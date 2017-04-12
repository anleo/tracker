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
        let parentBoard = data.board || null;
        data = _.omit(data, ['board']);

        return new Promise(function (resolve, reject) {
            let board = new Board(data);

            // TODO @@@id: need to add field isRoot
            board
                .save()
                .then((board) => {
                    BoardItemService
                        .createBoardItem({item: board, board: parentBoard})
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

    this.updateBoard = function (boardId, data, user) {
        let userId = user && user._id ? user._id : user;

        return new Promise(function (resolve, reject) {
            Board.findById(boardId)
                .exec()
                .then((board) => {
                    if (!board) {
                        return reject(new Error('Board not found'));
                    }

                    if (!self.hasAccess(board, userId)) {
                        return reject(new Error('You cannot modify this board'));
                    }

                    board = _.assign({}, board, data);

                    Board.update({_id: board._id}, {$set: board}, {new: true})
                        .then((board) => resolve(board), (err) => reject(err));
                });
        });
    };

    this.hasAccess = function (board, user) {
        user = user && user._id ? user._id : user;
        return !!(self.isOwner(board, user) || self.hasInShared(board, user));
    };

    this.isOwner = function (board, user) {
        user = user && user._id ? user._id : user;
        return board.owner && board.owner.toString() === user.toString();
    };

    this.hasInShared = function (board, user) {
        user = user && user._id ? user._id : user;
        let shared = board.shared.map((user) => user.toString());
        return _.contains(shared, user.toString());
    };
};
module.exports = BoardService;
