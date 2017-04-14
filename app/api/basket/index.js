module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardService = app.container.get('BoardService');
    let BasketService = app.container.get('BasketService');

    // @@ IraU rethink logic
    app.get('/api/baskets/:userId', function (req, res) {
        let query = {owner: req.params.userId, type: 'basket', status: ""};
        BoardService.getLastBoardByQuery(query)
            .then((basket) => {
                if (!basket) {

                    return BasketService.create(req.user)
                        .then((basket) => {
                            res.json(basket);
                        })
                        .catch((err) => {
                            res.status(400).json(err)
                        });

                }
                res.json(basket);
            })
            .catch((err) => {
                res.status(400).json(err)
            });
    });

// @@ IraU need to check
    app.put('/api/baskets/:basketId', function (req, res) {
        BoardService.update(req.body)
            .then((board) => {
                res.json(board);
            })
            .catch((err) => {
                res.status(400).json({error: err})
            });

    });

    app.post('/api/baskets', function (req, res) {
        BasketService.create(req.user)
            .then((basket) => {
                res.json(basket);
            })
            .catch((err) => {
                res.status(400).json(err)
            });
    });

    //TODO @@@ira check route(maybe without user?)
    app.get('/api/baskets/:userId/history', function (req, res) {
        let query = {owner: req.user._id, type: 'basket', status: 'finished'};

        BoardService.getBoardsByOptions(query)
            .then((baskets) => {
                res.json(baskets);
            })
            .catch((err) => {
                res.status(400).json(err)
            });
    });
};
