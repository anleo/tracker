module.exports = function (app) {
    let BoardItemService = app.container.get('BoardItemService');
    let BoardService = app.container.get('BoardService');
    let _ = require('lodash');

    app.get('/api/boards/:board/boardItems', function (req, res) {
        BoardService
            .getById(req.params.board)
            .then((board) => {
                if (!board) {
                    return res.status(400).json({error: 'Board was not found'});
                }

                let user = req.user && req.user._id ? req.user._id : user;
                // let user = '5514462ae4eb270b4f115c2c';

                if (BoardService.hasInShared(board, user)) {
                    BoardItemService.getItemsByOptions({board: board, isRoot: false})
                        .then((boardItems) => res.json(boardItems))
                        .catch((err) => res.status(400).json({error: err}));
                } else {
                    res.status(400).json({error: 'You haven\'t access to this board'});
                }
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.post('/api/boards/:board/boardItems', function (req, res) {
        BoardService
            .getById(req.params.board)
            .then((board) => {
                let data = {
                    board: board,
                    type: req.body.type,
                    item: req.body.item,
                    project: board.project
                };

                BoardItemService.create(data)
                    .then((boardItem) => res.json(boardItem))
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}))
    });
};
