let BasketService = function (Board, BoardService, BoardItemService) {
    let _ = require('lodash');
    let self = this;

    this.create = function (user) {
        return new Promise(function (resolve, reject) {
            let basket = new Board();
            basket.owner = user._id;
            // @@IraU change title
            basket.title = "Basket";
            basket.type = "basket";
            basket
                .save()
                .then((basket) => {
                    let query = {owner: user._id, type: 'basket', status: "finished"};
                    self.prepareBoardItems(basket, query)
                        .then(() => {
                            resolve(basket);
                        }, (err) => reject(err))

                }, (err) => reject(err));
        });
    };

    this.prepareBoardItems = function (newBoard, query) {
        return BoardService.getLastBoardByQuery(query)
            .then((board) => {
                if (!board) {
                    //TODO @@@ira check this case
                    return Promise.resolve();
                }
                return BoardItemService.getUnfinishedBoardItems(board._id)
                    .then((boardItems) => {
                        if (boardItems && !boardItems.length) {
                            return Promise.resolve();
                        }
                        return Promise.all(_.map(boardItems, (boardItem) => {
                            let item = {};
                            item.board = newBoard._id;
                            item.item = boardItem.item;
                            return BoardItemService.createTaskItem(item)

                        }));
                    }, (err) => Promise.reject(err))

            });
    }

};
module.exports = BasketService;
