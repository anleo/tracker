module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardItem = app.container.get('BoardItem');
    let BoardItemTask = app.container.get('BoardItemTask');
    let BoardItemBoard = app.container.get('BoardItemBoard');

    // TODO @@@id: move to service (get boardItem)
    //@@@ TODO check access to this board
    app.get('/api/projects/:projectId/boardItems/root', function (req, res) {
        Board.find({project: req.params.projectId})
            .lean()
            .exec()
            .then((boards) => {
                if (!boards.length) {
                    return res.json(boards);
                }

                boards = boards.map((board) => board._id);
                BoardItem
                    .find({board: {$in: boards}, type: 'board', isRoot: true})
                    .populate('item')
                    .lean()
                    .exec()
                    .then((boardItems) => res.json(boardItems))
                    .catch((err) => res.status(400).json(err));
            })
            .catch((err) => res.status(400).json(err));
    });

    app.post('/api/boards/:boardId/boardItems', function (req, res) {
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
            return res.status(400).json('No right method to create BoardItem');
        }

        method = method.method;

        let boardItem = {
            board: req.params.boardId,
            item: req.body.item,
            isRoot: req.body.isRoot || false
        };

        method.count(boardItem).exec().then((count) => {
            if (count) {
                return res.status(400).json('This BoardItem already exists');
            }

            new method(boardItem)
                .save()
                .then((boardItem) => res.json(boardItem))
                .catch((err) => res.status(400).json(err));
        });
    });

    //@@@ TODO check access to this board
    app.get('/api/boards/:boardId/boardItems', function (req, res) {
        BoardItem
            .find({board: req.params.boardId, isRoot: false})
            .populate('item')
            .lean()
            .exec()
            .then((boardItems) => res.json(boardItems))
            .catch((err) => res.status(400).json(err));
    });

    // app.post('/api/move/boardItem/to/:boardItemId', function (req, res) {
    //     let boardItem = new BoardItemBoard();
    //     boardItem.item = req.params.itemId;
    //     boardItem.parent = req.params.toId;
    //     boardItem.status = '';
    //     boardItem.save().then((boardItem) => res.json(boardItem)).catch((err) => res.status(400).json(err));
    // });

};
