module.exports = function (app) {
    let BoardService = app.container.get('BoardService');
    let BoardItemService = app.container.get('BoardItemService');

    app.get('/api/projects/:projectId/boards', function (req, res) {
        let options = {
            shared: req.user._id,
            project: req.params.projectId
        };

        BoardService.getBoardsByOptions(options)
            .then((boards) => {
                if (!boards.length) {
                    return res.status(404).json({error: 'Boards were not found'});
                }

                let boardsIds = boards.map((board) => board._id);

                let options = {
                    $or: [
                        {board: {$exists: false}},
                        {board: null}
                    ],
                    item: {$in: boardsIds},
                    type: 'board',
                    project: req.params.projectId,
                    isRoot: true
                };

                BoardItemService
                    .getItemsByOptions(options)
                    .then((boardItems) => res.json(boardItems))
                    .catch((err) => res.status(400).json({error: err}));
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.post('/api/projects/:projectId/boards', function (req, res) {
        let data = {
            title: req.body.title,
            project: req.params.projectId,
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
