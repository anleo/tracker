module.exports = function (app) {
    let Board = app.container.get('Board');

   // @@ IraU rethink logic
    app.get('/api/baskets/:userId', function (req, res) {
        let query = {owner: req.params.userId, type: 'basket'};
        Board.findOne(query)
            .lean()
            .sort('-createdAt')
            .exec()
            .then((board) => {
                if (!board) {
                    let board = new Board();

                    board.owner = req.user;
                    board.title = "Basket 22.03";
                    board.type = "basket";

                    return board.save()
                        .then((board) => {
                            res.json(board);
                        })
                        .catch((err) => {
                            console.log('err', err);
                            res.status(400).json(err)
                        });

                }
                res.json(board);
            })
            .catch((err) => {
                console.log('err', err);
                res.status(400).json(err)
            });


    })
};
