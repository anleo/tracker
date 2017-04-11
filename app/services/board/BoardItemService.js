let _ = require('lodash');

let BoardItemService = function (BoardItem,
                                 BoardItemBoard,
                                 BoardItemTask) {

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
    }

};

module.exports = BoardItemService;