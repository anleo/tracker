let BoardService = function (Board,
                             BoardItemBoard,
                             BoardItemService,
                             SimpleMetricsService) {
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

            board
                .save()
                .then((board) => {
                    BoardItemService
                        .createBoardItem({item: board, board: parentBoard})
                        .then(() => {
                            self.updateParentsByItem(board)
                                .then(() => resolve(board));
                        })
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

    this.getByQuery = function (query) {
        return new Promise(function (resolve, reject) {
            Board
                .findOne(query)
                .exec()
                .then((board) => resolve(board), (err) => reject(err))
        });
    };

    this.remove = function (board) {
        return new Promise(function (resolve, reject) {
            Board
                .remove({_id: board.id})
                .then(() => {
                    BoardItemService.removeBoardItemsByItem(board)
                        .then((boardsToUpdate) => {
                            let promises = boardsToUpdate.map((board) => self.updateParentStatus(board));
                            return Promise.all(promises);
                        })
                        .then(() => resolve(true))
                        .catch((err) => reject(err));
                }, (err) => reject(err));
        });
    };

    this.updateBoard = function (board, data) {
        let boardId = board && board._id ? board._id : board;

        return new Promise(function (resolve, reject) {
            Board.findOneAndUpdate({_id: boardId}, {$set: data}, {new: true})
                .then((board) => {
                    if (!board) {
                        return reject(new Error('board not found'));
                    }

                    return board;
                })
                .then((board) => self.updateParentsByItem(board))
                .then((board) => resolve(board), (err) => reject(err));
        });
    };

    this.updateParentStatus = function (parent) {
        let parentId = parent && parent._id ? parent._id : parent;
        return new Promise((resolve, reject) => {
            BoardItemService
                .getItemsByOptions({board: parentId})
                .then((children) => {
                    children = children || [];

                    children = children.map((child) => child.item);
                    return new Promise((res, rej) => {
                        self.getById(parentId)
                            .then((_parent) => {
                                if (!_parent) {
                                    return resolve();
                                }

                                return self.setParentStatusByChildren(_parent, children);
                            })
                            .then((updatedParent) => res(updatedParent))
                            .catch((err) => rej(err));
                    })
                })
                .then((_parent) => {
                    if (_parent) {
                        return self.updateBoard(parent, _parent)
                    }
                })
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    };

    this.updateParentsByItem = function (item) {
        let itemId = item && item._id ? item._id : item;

        return new Promise((resolve, reject) => {
            BoardItemService
                .getItemsByOptions({item: itemId})
                .then((boardItems) => {
                    if (!boardItems || !boardItems.length) {
                        return resolve();
                    }

                    let parents = boardItems.map((boardItem) => boardItem.board);
                    let promises = parents.map((parentBoard) => self.updateParentStatus(parentBoard));
                    return Promise.all(promises);
                })
                .then(() => resolve(item))
                .catch((err) => reject(err));
        });
    };

    this.setParentStatusByChildren = function (item, children) {
        children = children || [];
        return new Promise((resolve) => {
            let countAccepted = 0;
            let countNew = 0;

            children.forEach(function (child) {
                if (child.status === '') {
                    countNew++;
                } else if (child.status == 'accepted') {
                    countAccepted++;
                }
            });

            if (children.length === countAccepted) {
                item.status = 'accepted';
            } else if (children.length === countNew) {
                item.status = '';
            } else {
                item.status = 'in progress';
            }

            // if no children tasks and boards reset it to 'new' board
            if (!children.length) {
                item.status = '';
            }

            return resolve(item);
        });
    };

    this.hasAccess = function (board, user) {
        user = user && user._id ? user._id : user;
        return !!(self.isOwner(board, user) || self.hasInShared(board, user));
    };

    this.hasRelatives = (item, children) => {
        item = item && item._id ? item._id : item;
        children = children.map((child) => {
            return child && child._id ? child._id : child;
        });

        return _.find(children, (child) => {
            return child.toString() === item.toString();
        });
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

    //TODO @@@ira check this method

    this.update = function (updatedBoard) {
        return new Promise(function (resolve, reject) {
            SimpleMetricsService.calculatePointCostByBoard(updatedBoard)
                .then((pointCost) => {
                    updatedBoard.pointCost = pointCost;
                    self.getById(updatedBoard._id)
                        .then((board) => {
                            _.assign(board, updatedBoard);
                            board
                                .save()
                                .then((board) => {
                                    resolve(board)
                                }, (err) => reject(err));
                        })

                })
        });

    };

    this.getLastBoardByQuery = function (query) {
        return new Promise(function (resolve, reject) {
            Board.findOne(query)
                .lean()
                .sort('-createdAt')
                .exec()
                .then((board) => resolve(board), (err) => reject(err))
        });
    };

};
module.exports = BoardService;
