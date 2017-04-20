module.exports = function (app) {
    let BoardItemService = app.container.get('BoardItemService');
    let BoardService = app.container.get('BoardService');
    let TaskService = app.container.get('TaskService');

    let _ = require('lodash');
    let async = require('async');

    app.param('boardItemId', (req, res, next, boardItemId) => {
        BoardItemService.getById(boardItemId)
            .then((boardItem) => {
                if (!boardItem) {
                    return res.status(404).json();
                }

                req.BoardItem = boardItem;
                next();
            })
    });

    app.get('/api/projects/:projectId/boardItems/root', function (req, res) {
        let options = {
            $or: [{
                shared: req.user._id,
                project: req.params.projectId
            }, {
                owner: req.user._id,
                project: req.params.projectId
            }]
        };

        BoardService.getBoardsByOptions(options)
            .then((boards) => {
                if (!boards.length) {
                    return res.json([]);
                }

                let boardsIds = boards.map((board) => board._id);

                let options = {
                    $or: [
                        {board: {$exists: false}},
                        {board: null}
                    ],
                    item: {$in: boardsIds},
                    type: 'board'
                };

                BoardItemService
                    .getItemsByOptions(options)
                    .then((boardItems) => res.json(boardItems))
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.post('/api/boards/:boardId/boardItems', function (req, res) {
        let data = {
            board: req.Board,
            type: req.body.type,
            item: req.body.item
        };

        BoardItemService.create(data)
            .then((boardItem) => res.json(boardItem))
            .catch((err) => res.status(400).json({error: err}));
    });

    app.put('/api/boards/:boardId/boardItems/:boardItemId', function (req, res) {
        BoardItemService
            .update(req.BoardItem, {timeLog: req.body.timeLog})
            .then((boardItem) => res.json(boardItem))
            .catch((err) => res.status(400).json({error: err}))
    });

    app.get('/api/boards/:boardId/boardItems', function (req, res) {
        BoardItemService.getItemsByOptions({board: req.Board._id})
            .then((boardItems) => res.json(boardItems))
            .catch((err) => res.status(400).json({error: err}));
    });

    app.delete('/api/boards/:boardId/boardItems/:boardItemId', function (req, res) {
        BoardItemService
            .removeBoardItem(req.params.boardItemId)
            .then(() => {
                res.json({});
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.get('/api/boards/:boardId/boardItems/:boardItemId/checkRelations', function (req, res) {
        let allRelatives = [];
        // TODO @@@id: move to service
        BoardItemService
            .getItemsByOptions({board: req.Board, type: 'task'})
            .then((items) => {
                async.each(items, (boardItem, callback) => {
                    allRelatives.push(boardItem.item._id);
                    TaskService.getTaskRelatives(boardItem.item, (err, relatives) => {
                        if (err) {
                            return next(err);
                        }

                        allRelatives = allRelatives.concat(relatives);
                        callback();
                    });
                }, (err) => {
                    if (err) {
                        return next(err);
                    }

                    allRelatives = _.uniq(allRelatives, (relative) => {
                        return relative.toString();
                    });

                    if (hasRelative(req.BoardItem.item, allRelatives)) {
                        res.json(true);
                    } else {
                        res.json(false);
                    }
                });
            });
    });

    // TODO @@@id: move to service
    function hasRelative(task, relatives) {
        return _.find(relatives, function (relative) {
            return relative.toString() === task._id.toString();
        });
    }
};
