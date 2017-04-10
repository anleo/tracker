module.exports = function (app) {
    let Task = app.container.get('Task');
    let Board = app.container.get('Board');
    let BoardItem = app.container.get('BoardItem');
    let BoardItemTask = app.container.get('BoardItemTask');
    let BoardItemBoard = app.container.get('BoardItemBoard');

    // TODO @@@id: move to service (get boardItem)
    app.get('/api/projects/:project/boards', function (req, res) {
        Board.find({project: req.params.project})
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

// TODO @@@id: move to service (createBoard)
    app.post('/api/projects/:project/boards', function (req, res) {
        let board = new Board();
        board.title = req.body.title;
        board.project = req.params.project;
        board.status = '';
        board.time = req.body.title || 0;

        // board.owner = "5514462ae4eb270b4f115c2c";
        board.owner = req.user;
        board.share = req.body.share;

        board.save().then((board) => {
            new BoardItemBoard({
                item: board
            }).save()
                .then(() => res.json(board))
                .catch((err) => res.status(400).json(err));
        }).catch((err) => res.status(400).json(err));
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

    // app.post('/api/move/boardItem/to/:boardItemId', function (req, res) {
    //     let boardItem = new BoardItemBoard();
    //     boardItem.item = req.params.itemId;
    //     boardItem.parent = req.params.toId;
    //     boardItem.status = '';
    //     boardItem.save().then((boardItem) => res.json(boardItem)).catch((err) => res.status(400).json(err));
    // });
};
