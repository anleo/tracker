let BasketService = function (Board, BoardService, BoardItemService) {
    let _ = require('lodash');
    let self = this;

    this.create = function (user) {
        return new Promise(function (resolve, reject) {
            let basket = new Board();
            basket.owner = user;
            // @@IraU change title
            basket.title = "Basket";
            basket.type = "basket";
            basket
                .save()
                .then((basket) => {
                    let query = {owner: user, type: 'basket', status: "finished"};
                    self.prepareBoardItem(basket, query)
                        .then((boardItems) => {
                            if (!boardItems) {
                                reject();
                            }
                            resolve(basket);
                        }, (err) => reject(err))

                }, (err) => reject(err));
        });
    };

    this.prepareBoardItem = function (newBoard, query) {
        return BoardService.getLastBoardByQuery(query)
            .then((board) => {
                return BoardItemService.getUnfinishedBoardItems(board._id)
                    .then((boardItems) => {
                        if (boardItems && !boardItems.length) {
                            return Promise.resolve([]);
                        }
                        return Promise.all(_.map(boardItems, (boardItem) => {
                            let item = {};
                            item.board = newBoard._id;
                            item.item = boardItem.item;
                            return BoardItemService.createTaskItem(item)

                        }));
                    }, (err) => console.log('err', err))

            });
    }

};
module.exports = BasketService;
