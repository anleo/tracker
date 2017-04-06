module.exports = function (app) {
    let Board = app.container.get('Board');

    app.get('/api/projects/:project/boards', function (req, res) {
        Board.find({project: req.params.project})
            .then(boards => res.json(boards));
    });
};
