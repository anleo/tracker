module.exports = function (app) {
    let BoardService = app.container.get('BoardService');
    let BoardItemService = app.container.get('BoardItemService');

    app.post('/api/projects/:projectId/boards', function (req, res) {
        let data = {
            title: req.body.title,
            project: req.params.projectId,
            status: req.body.status || '',
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
