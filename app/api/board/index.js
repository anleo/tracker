module.exports = function (app) {
    let BoardService = app.container.get('BoardService');
    let BoardItemService = app.container.get('BoardItemService');

    app.get('/api/projects/:project/boards', function (req, res) {
        let options = {
            $or: [
                {board: {$exists: false}},
                {board: null}
            ],
            type: 'board',
            project: req.params.project,
            isRoot: true
        };

        BoardItemService
            .getItemsByOptions(options)
            .then((boardItems) => res.json(boardItems))
            .catch((err) => res.status(400).json({error: err}));
    });

    app.post('/api/projects/:project/boards', function (req, res) {
        let data = {
            title: req.body.title,
            project: req.params.project,
            status: '',
            time: req.body.time || 0,
            owner: req.user,
            shared: req.body.shared
        };

        BoardService
            .create(data)
            .then((board) => res.json(board))
            .catch((err) => res.status(400).json({error: err}));
    });
};
