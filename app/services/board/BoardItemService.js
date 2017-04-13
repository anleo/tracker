let BoardItemService = function (BoardItem,
                                 BoardItemBoard,
                                 BoardItemTask) {
    let _ = require('lodash');
    let self = this;

    this.getById = function (id) {
        return new Promise((resolve, reject) => {
            BoardItem
                .findById(id)
                .populate('item')
                .lean()
                .exec()
                .then((item) => resolve(item), (err) => reject(err));
        })
    }

    this.create = function (data) {
        let self = this;
        return new Promise(function (resolve, reject) {
            const models = [{
                type: 'task',
                collection: BoardItemTask,
                create: self.createTaskItem
            }, {
                type: 'board',
                collection: BoardItemBoard,
                create: self.createBoardItem
            }];

            let model = models.find((model) => model.type === data.type);

            if (!model) {
                return reject(new Error('No right type to create BoardItem'));
            }

            let boardItem = _.omit(data, ['type']);

            model.collection.count(boardItem).exec().then((count) => {
                if (count) {
                    return reject(new Error('This BoardItem already exists'));
                }

                model.create(boardItem)
                    .then((boardItem) => resolve(boardItem))
                    .catch((err) => reject(err));
            });
        });
    };

    //TODO @@@dr converse update with @feya because create different
    this.update = function (boardItem, data) {
        return new Promise(function (resolve, reject) {
            BoardItem.findById(boardItem._id)
                .then((boardItem) => {
                        _.assign(boardItem, data);

                        boardItem.save()
                            .then((boardItem) => resolve(boardItem), (err) => reject(err))
                    },
                    (err) => reject(err));
        });
    }

    this.createBoardItem = function (data) {
        return new Promise(function (resolve, reject) {
            new BoardItemBoard(data)
                .save()
                .then((item) => resolve(item), (err) => reject(err));
        });
    };

    this.createTaskItem = function (data) {
        return new Promise(function (resolve, reject) {
            new BoardItemTask(data)
                .save()
                .then((item) => resolve(item), (err) => reject(err));
        });
    };

    this.getItemsByOptions = function (options) {
        return new Promise(function (resolve, reject) {
            BoardItem
                .find(options)
                .populate('item')
                .lean()
                .exec()
                .then((boardItems) => resolve(boardItems), (err) => reject(err))
        });
    };

    this.removeBoardItem = function (id) {
        return new Promise(function (resolve, reject) {
            BoardItem.findById(id)
                .then((boardItem) => {
                        boardItem.remove()
                            .then(() => {
                                    resolve();
                                },
                                (err) => reject(err))
                    },
                    (err) => reject(err));
        });
    };

    this.getUnfinishedBoardItems = function (boardId) {
        let query = {board: boardId};
        return self.getItemsByOptions(query)
            .then((boardItems) => {
                    return Promise.all(_.filter(boardItems, (boardItem) => {
                        return boardItem.item.status !== "accepted";
                    }));

                },
                (err) => console.log('err', err))
    }

};

module.exports = BoardItemService;