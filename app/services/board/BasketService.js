let BasketService = function (Board, TaskService, BoardService, BoardItemService) {
    let _ = require('lodash');
    let self = this;
    let moment = require('moment');

    this.create = function (user) {
        return new Promise(function (resolve, reject) {
            self.countUserBaskets(user)
                .then((number) => {
                    let basketNumber = number + 1;
                    let basketDate = " (" + moment().utc(Date.now()).format("DD-MM-YYYY") + ')';

                    let basket = new Board();
                    basket.title = "#" + basketNumber + " Basket" + basketDate;
                    basket.owner = user._id;
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
                })
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

    this.countUserBaskets = function (user) {
        return new Promise(function (resolve, reject) {
            let query = {owner: user._id, type: 'basket'};

            Board
                .count(query)
                .exec()
                .then((number) => resolve(number),
                    (err) => reject(err))
        });
    };

    this.addBoardItem = function (data) {
        let self = this;

        return new Promise((resolve, reject) => {
            if (data.type == 'complex') {

                BoardItemService.create(data)
                    .then(() => {
                        TaskService.deepFindByQuery(data.item, {}, (err, tasks) => {
                            if (err) return reject(err);

                            let promises = tasks.map((task) => {
                                let params = {
                                    board: data.board,
                                    type: task.simple ? 'task' : 'complex',
                                    item: task
                                }

                                return BoardItemService.create(params);
                            })

                            resolve(Promise.all(promises));
                        })
                    })
                    .catch((err) => reject(err));


            } else if (data.type == 'task') {
                resolve(BoardItemService.create(data))
            }
        })
    }


};
module.exports = BasketService;
