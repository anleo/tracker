module.exports = function (app) {
    let BoardItemService = app.container.get('BoardItemService');
    let BoardService = app.container.get('BoardService');

    app.get('/api/projects/:projectId/boardItems/root', function (req, res) {
        let options = {
            shared: req.user._id,
            project: req.params.projectId
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
                    type: 'board',
                    project: req.params.projectId,
                    isRoot: true
                };

                BoardItemService
                    .getItemsByOptions(options)
                    .then((boardItems) => res.json(boardItems))
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.post('/api/boards/:boardId/boardItems', function (req, res) {
        BoardService
            .getById(req.params.boardId)
            .then((board) => {
                if (!board) {
                    return res.status(404).json({error: 'Board was not found'});
                }

                let data = {
                    board: board,
                    type: req.body.type,
                    item: req.body.item,
                    project: board.project,
                    isRoot: req.body.isRoot || false
                };

                BoardItemService.create(data)
                    .then((boardItem) => res.json(boardItem))
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}))
    });

    app.get('/api/boards/:boardId/boardItems', function (req, res) {
        BoardService
            .getById(req.params.boardId)
            .then((board) => {
                if (!board) {
                    return res.status(404).json({error: 'Board was not found'});
                }

                let user = req.user && req.user._id ? req.user._id : user;

                if (BoardService.hasInShared(board, user)) {
                    BoardItemService.getItemsByOptions({board: board, isRoot: false})
                        .then((boardItems) => res.json(boardItems))
                        .catch((err) => res.status(400).json({error: err}));
                } else {
                    res.status(403).json({error: 'You haven\'t access to this board'});
                }
            })
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
};
