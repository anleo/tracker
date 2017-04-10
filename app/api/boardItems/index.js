module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardItem = app.container.get('BoardItem');
    let BoardItemTask = app.container.get('BoardItemTask');
    let BoardItemBoard = app.container.get('BoardItemBoard');

    app.get('/api/boards/:board/boardItems', function (req, res) {
        Board.findById(req.params.board)
            .then(function (board) {
                if (!board) {
                    return res.status(400).json(new Error('Board was not found'));
                }

                let hasAccess = board.shared.map((user) => {
                    return user === req.user._id;
                });

                if (hasAccess) {
                    BoardItem
                        .find({board: req.params.board})
                        .populate('item')
                        .lean()
                        .exec()
                        .then((boardItems) => res.json(boardItems))
                        .catch((err) => res.status(400).json(err));
                } else {
                    res.status(403).json(new Error('You haven\'t access to this board'));
                }
            })
            .catch((err) => res.status(400).json(err));
    });

    app.post('/api/boards/:board/boardItems', function (req, res) {
        // TODO @@@id: move to service (createBoardItem)
        const methods = [{
            type: 'task',
            method: BoardItemTask
        }, {
            type: 'board',
            method: BoardItemBoard
        }];

        let method = methods.find((method) => method.type === req.body.type);

        if (!method) {
            return res.status(400).json(new Error('No right method to create BoardItem'));
        }

        method = method.method;

        let boardItem = {
            board: req.params.board,
            item: req.body.item
        };

        method.count(boardItem).exec().then((count) => {
            if (count) {
                return res.status(400).json(new Error('This BoardItem already exists'));
            }

            new method(boardItem)
                .save()
                .then((boardItem) => res.json(boardItem))
                .catch((err) => res.status(400).json(err));
        });
    });
};
