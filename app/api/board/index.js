module.exports = function (app) {
    let _ = require('lodash');
    let BoardService = app.container.get('BoardService');
    let Board = app.container.get('Board');
    let BoardItemService = app.container.get('BoardItemService');

    app.get('/api/boards/:boardId', function (req, res) {
        let boardId = req.param && req.params.boardId;

        if (boardId) {
            BoardService
                .getById(boardId)
                .then((board) => res.json(board))
                .catch((err) => res.status(400).json({error: err}));
        } else {
            return res.status(400).json({error: 'boardId was not present'})
        }
    });

    app.post('/api/projects/:projectId/boards', function (req, res) {
        let data = _.assign({}, req.body, {
            project: req.params.projectId,
            owner: req.user,
            board: req.body.board
        });

        BoardService
            .create(data)
            .then((board) => res.json(board))
            .catch((err) => res.status(400).json({error: err}));
    });

    app.put('/api/projects/:projectId/boards/:boardId', function (req, res) {
        BoardService
            .updateBoard(req.params.boardId, req.body, req.user)
            .then((board) => res.json(board))
            .catch((err) => res.status(400).json({error: err}));
    });
};
