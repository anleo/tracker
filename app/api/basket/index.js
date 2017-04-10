module.exports = function (app) {
    let Board = app.container.get('Board');
    let BoardItem = app.container.get('BoardItem');
    let BoardItemUserBoard = app.container.get('BoardItemUserBoard');


    app.get('/api/baskets/:userId', function (req, res) {
let query = {owner: req.params.userId, type: 'userBoard'};
        console.log(query);
        BoardItem.find()
            // .lean()
            // .limit(1)
            .sort('-createdAt')
            .exec()
            .then((boardItem) => {
                console.log('board', boardItem);
                console.log('req.user', req.user);
                if (boardItem && !boardItem.length) {
                    let board = new Board();

                    board.owner = req.user;
                    board.title = "Basket 22.03";

                    return board.save()
                        .then((board) => {
                            new BoardItemUserBoard({
                                item: board,
                                owner: req.user._id
                            }).save()
                                .then(() => res.json(board))
                                // .catch((err) => res.status(400).json(err));
                        })
                        .catch((err) =>{
                            console.log('err', err);
                            res.status(400).json(err)
                        } );

                }
                Board.findById(boardItem._id)
                    .lean()
                    .exec()
                    .then((board) => {
                res.json(board);
                })
                // .catch((err) => res.status(400).json(err));
            })
            .catch((err) =>{
                console.log('err', err);
                res.status(400).json(err)
            } );


    })
};
