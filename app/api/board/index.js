module.exports = function (app) {
    let Task = app.container.get('Task');
    let Board = app.container.get('Board');
    let BoardItemTask = app.container.get('BoardItemTask');
    let BoardItemBoard = app.container.get('BoardItemBoard');

    app.get('/api/projects/:projectId/boards', function (req, res) {
        Board.find({project: req.params.projectId})
            .then(boards => res.json(boards));
    });

    app.post('/api/projects/:projectId/boards', function (req, res) {
        let board = new Board();
        board.title = req.body.title;
        board.project = req.params.projectId;
        board.status = req.body.status || '';
        // board.owner = "5514462ae4eb270b4f115c2c";
        board.owner = req.user;
        board.save().then((board) => res.json(board)).catch((err) => res.status(400).json(err));
    });

    app.post('/api/move/item/:itemId/to/:toId', function (req, res) {
        let boardItem = new BoardItemBoard();
        boardItem.item = req.params.itemId;
        boardItem.parent = req.params.toId;
        boardItem.save().then((boardItem) => res.json(boardItem)).catch((err) => res.status(400).json(err));
    });
};
