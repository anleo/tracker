module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardService = app.container.get('BoardService');
    let BasketService = app.container.get('BasketService');
    let moment = require('moment');

    app.param('basketId', (req, res, next, basketId) => {
        BoardService
            .getById(basketId)
            .then((board) => {
                if (!board) {
                    return res.status(404).json('Board was not found');
                }

                if (!BoardService.hasAccess(board, req.user)) {
                    return res.status(403).send('You haven\'t access to this board');
                }

                req.Basket = board;
                next();
            })
            .catch((err) => next(err))
    });

    function getStartDate(date) {
        return moment(date).startOf('day').toDate()
    }

    function getEndDate(date) {
        return moment(date).endOf('day').toDate();
    }

    // @@ IraU rethink logic
    app.get('/api/baskets/:userId', function (req, res) {
        //TODO this route points to multiple baskets
        //TODO should be like this - /api/users/:userId/baskets/active

        let query = {
            owner: req.params.userId,
            type: 'basket',
            status: {$nin: ['accepted', 'finished']}
        };

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
        //TODO should use user from params or req.user
        //TODO update route - it's not a history, just boards

        let query = {
            owner: req.user._id,
            type: 'basket',
            status: 'finished'
        };

        let date = req.query.query && JSON.parse(req.query.query).date;
        date = Date.parse(date);

        if (date) {
            query.createdAt = {$gte: getStartDate(date), $lte: getEndDate(date)}
        }

        BoardService.getBoardsByOptions(query)
            .then((baskets) => {
                res.json(baskets);
            })
            .catch((err) => {
                res.status(400).json(err)
            });
    });

    app.post('/api/baskets/:basketId/boardItems', function(req, res){
        let data = {
            board: req.Basket,
            type: req.body.type,
            item: req.body.item
        };

        BasketService.addBoardItem(data)
            .then((boardItem) => res.json())
            .catch((err) => res.status(400).json({error: err}));
    })
};
