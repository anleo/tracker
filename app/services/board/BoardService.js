let BoardService = function (Board,
                             BoardItemBoard,
                             BoardItemService) {
    let _ = require('lodash');

    let self = this;

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
                        .createBoardItem({item: board})
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

    this.hasAccess = function(board, user) {
        user = user && user._id ? user._id : user;
        return self.isOwner(board, user) || self.hasInShared(board, user);
    };

    this.isOwner = function(board, user) {
        return board.owner && board.owner.toString() === user.toString();
    };

    this.hasInShared = function (board, user) {
        let shared = board.shared.map((user) => user.toString());
        return _.contains(shared, user.toString());
    };
};
module.exports = BoardService;
