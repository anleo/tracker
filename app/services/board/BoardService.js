let BoardService = function (Board,
                             BoardItemBoard,
                             BoardItemService) {
    let _ = require('lodash');

    this.get = function (project) {
        return new Promise(function (resolve, reject) {
            Board
                .find({project: project})
                .exec()
                .then((boards) => resolve(boards), (err) => reject(err))
        });
    };

    this.getBoardsByOptions = function (options) {
        return new Promise(function (resolve, reject) {
            Board
                .find(options)
                .exec()
                .then((boards) => resolve(boards), (err) => reject(err))
        });
    };

    this.create = function (data) {
        return new Promise(function (resolve, reject) {
            let board = new Board();
            _.assign(board, data);

            board
                .save()
                .then((board) => {
                    BoardItemService
                        .createBoardItem(board, data.project)
                        .then(() => resolve(board))
                        .catch((err) => reject(err));
                }, (err) => reject(err));
        });
    };

    this.getById = function (id) {
        return new Promise(function (resolve, reject) {
            Board
                .findById(id)
                .exec()
                .then((board) => resolve(board), (err) => reject(err))
        });
    };

    this.hasInShared = function (board, user) {
        let shared = board.shared.map((user) => user.toString());
        return _.contains(shared, user.toString());
    }
};
module.exports = BoardService;
