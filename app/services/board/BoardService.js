let BoardService = function (Board,
                             BoardItemBoard,
                             BoardItemService) {
    let _ = require('lodash');

    this.get = function (project) {
        return new Promise(function (resolve, reject) {
            Board
                .find({project: project})
                .then((boards) => resolve(boards))
                .catch((err) => reject(err));
        });
    };

    this.create = function (data) {
        return new Promise(function (resolve, reject) {
            let board = new Board();
            _.assign(board, data);
            // board.owner = "5514462ae4eb270b4f115c2c";

            board
                .save()
                .then((board) => {
                    BoardItemService
                        .createBoardItem(board, data.project)
                        .then(() => resolve(board))
                        .catch((err) => reject(err));
                }).catch((err) => reject(err));
        });
    };

    this.getById = function (id) {
        return new Promise(function (resolve, reject) {
            Board
                .findById(id)
                .then((board) => resolve(board))
                .catch((err) => reject(err))
        });
    };

    this.hasInShared = function (board, user) {
        let shared = board.shared.map((user) => user.toString());
        return _.contains(shared, user.toString());
    }
};
module.exports = BoardService;
