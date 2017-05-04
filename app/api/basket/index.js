module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardService = app.container.get('BoardService');
    let BasketService = app.container.get('BasketService');
    let BoardItemService = app.container.get('BoardItemService');
    let TaskService = app.container.get('TaskService');

    let moment = require('moment');
    let async = require('async');

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

    app.post('/api/baskets/:basketId/boardItems', function (req, res) {
        let data = {
            board: req.Basket,
            type: req.body.type,
            item: req.body.item
        };

        BasketService.addBoardItem(data)
            .then((boardItem) => res.json())
            .catch((err) => res.status(400).json({error: err}));
    });

    app.delete('/api/baskets/:basketId/boardItems/:boardItemId', function (req, res, next) {
        BoardItemService.getById(req.params.boardItemId)
            .then((boardItem) => {
                if (boardItem.type == 'task') {
                    BasketService
                        .removeBoardItem(boardItem)
                        .then(() => res.json());
                } else {
                    BoardItemService.getItemsByOptions({board: req.Basket._id})
                        .then((basketBoardItems) => BasketService.removeComplexBoardItem(boardItem, basketBoardItems))
                        .then(() => res.json())
                        .catch((err) => next(err));
                }
            })
            .catch((err) => res.status(400).json({error: err}));
    });

    app.get('/api/baskets', function (req, res, next) {
        let results = [];
        let _query = JSON.parse(req.query.query);

        let query = {
            owner: {$in: _query.users},
            type: 'basket'
        };

        let date = _query.date;
        date = Date.parse(date);

        if (date) {
            query.createdAt = {$gte: getStartDate(date), $lte: getEndDate(date)}
        }

        async.parallel({
            projectsIds: (cb) => {
                TaskService
                    .getRootTasksByQuery({
                        $or: [
                            {
                                owner: req.user._id,
                            },
                            {
                                team: req.user._id,
                            }
                        ]
                    })
                    .then((tasks) => cb(null, tasks.map((task) => task._id.toString())))
                    .catch((err) => cb(err));
            },
            baskets: (cb) => {
                BoardService.getBoardsByOptions(query)
                    .then((baskets) => cb(null, baskets))
                    .catch((err) => cb(err));
            }
        }, (err, result) => {
            if (err) {
                return next(err);
            }

            async.eachSeries(result.baskets, (basket, cb) => {
                BoardItemService
                    .getItemsByOptions({
                        board: basket._id
                    })
                    .then((basketItems) => {
                        let items = basketItems.filter((basketItem) => {
                            let root = basketItem.item.root ? basketItem.item.root : basketItem.item._id;

                            return result.projectsIds.indexOf(root.toString()) >= 0;
                        });

                        results.push({
                            basket: basket,
                            items: items
                        });

                        cb();
                    })
                    .catch((err) => cb(err));
            }, (err) => {
                if (err) {
                    return next(err);
                }

                res.json(results);
            })
        });
    });
};
