module.exports = function (app) {
    let BoardItemService = app.container.get('BoardItemService');
    let BoardService = app.container.get('BoardService');

    app.param('boardItemId', (req, res, next, boardItemId) => {
        BoardItemService.getById(boardItemId)
            .then((boardItem) => {
                if (!boardItem) {
                    return res.status(404).json();
                }

                req.BoardItem = boardItem;
                next();
            })
    })

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
    })

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

    app.delete('/api/boards/:boardId/boardItems', function (req, res) {
        BoardItemService
            .removeBoardItemsByItem(req.params.boardId)
            .then(() => {
                res.json({});
            })
            .catch((err) => res.status(400).json({error: err}));
    });
};
