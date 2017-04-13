let SimpleMetricsService = function (BoardItemService) {
    let _ = require('lodash');
    let self = this;

    this.calculatePointsByBoard = function (boardId) {
        return new Promise(function (resolve, reject) {
            let query = {board: boardId};
            BoardItemService.getItemsByOptions(query)
                .then((boardItems) => {
                        let points = 0;
                        if (boardItems && !boardItems.length) {
                            resolve(points);
                        }
                        _.forEach(boardItems, (boardItem) => {
                            if (boardItem.item.simple === true) {
                                points += boardItem.item.points;
                            }
                        });
                        resolve(points);

                    },
                    (err) => reject(err))

        });
    };

    this.calculatePointCostByBoard = function (board) {
        return new Promise(function (resolve, reject) {
            self.calculatePointsByBoard(board._id)
                .then((points) => {
                        let pointCost = board.time && points ? (board.time / points) : 0;
                        resolve(pointCost);
                    },
                    (err) => reject(err))
        })
    }

};
module.exports = SimpleMetricsService;
