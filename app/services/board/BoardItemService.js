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

            let boardItem = {
                board: data.board,
                item: data.item,
                project: data.project
            };

            model.collection.count(boardItem).exec().then((count) => {
                if (count) {
                    return reject(new Error('This BoardItem already exists'));
                }

                model.create(data.item, data.project, data.board)
                    .then((boardItem) => resolve(boardItem))
                    .catch((err) => reject(err));
            });
        });
    };

    this.createBoardItem = function (item, project, parentBoard) {
        return new Promise(function (resolve, reject) {
            new BoardItemBoard({
                item: item,
                project: project,
                board: parentBoard
            })
                .save()
                .then((item) => resolve(item), (err) => reject(err));
        });
    };

    this.createTaskItem = function (item, project, parentBoard) {
        return new Promise(function (resolve, reject) {
            new BoardItemTask({
                item: item,
                project: project,
                board: parentBoard
            })
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

};

module.exports = BoardItemService;