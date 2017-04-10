module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardItem = app.container.get('BoardItem');
    let BoardItemBoard = app.container.get('BoardItemBoard');

    // TODO @@@id: move to service (createBoard)
    app.post('/api/projects/:projectId/boards', function (req, res) {
        let board = new Board();
        board.title = req.body.title;
        board.project = req.params.projectId;
        board.owner = req.user;
        board.status = req.body.status || '';
        board.time = req.body.time || 0;
        board.shared = req.body.shared;

        board.save()
            .then((board) => {
                new BoardItemBoard({
                    item: board
                }).save()
                    .then(() => res.json(board))
                    .catch((err) => res.status(400).json(err));
            })
            .catch((err) => res.status(400).json(err));
    });
};
