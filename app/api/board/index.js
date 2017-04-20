module.exports = function (app) {
    let _ = require('lodash');
    let BoardService = app.container.get('BoardService');
    let Board = app.container.get('Board');
    let BoardItemService = app.container.get('BoardItemService');
    let SimpleMetricsService = app.container.get('SimpleMetricsService');

    app.param('boardId', function (req, res, next, id) {
        BoardService
            .getById(id)
            .then((board) => {
                if (!board) {
                    return res.status(404).json('Board was not found');
                }

                if (!BoardService.hasAccess(board, req.user)) {
                    return res.status(403).send('You haven\'t access to this board');
                }

                req.Board = board;
                next();
            })
            .catch((err) => next(err))
    });

    app.get('/api/boards/:boardId', function (req, res) {
        res.json(req.Board);
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
            .updateBoard(req.Board, req.body)
            .then((board) => res.json(board))
            .catch((err) => res.status(400).json({error: err}));
    });

    app.delete('/api/projects/:projectId/boards/:boardId', function (req, res) {
        if (req.Board.type === 'basket') {
            return res.status(403).json({error: 'Basket can not be deleted'})
        }

        BoardService
            .remove(req.Board)
            .then(() => res.status(200).send())
            .catch((err) => res.status(400).json({error: err}));
    });

    // @@IraU req.Board exist, rethink route and metrics service

    app.put('/api/boards/:boardId/metrics', function (req, res) {
        BoardService.getById(req.params.boardId)
            .then((board) => {
                BoardService.update(board)
                    .then((board) => {
                        res.json(board);
                    })
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}));
    })
};
