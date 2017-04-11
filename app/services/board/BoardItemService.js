let BoardItemService = function (BoardItem,
                                 BoardItemBoard,
                                 BoardItemTask) {

    this.create = function (data) {
        let self = this;
        return new Promise(function (resolve, reject) {
            const methods = [{
                type: 'task',
                model: BoardItemTask,
                method: self.createTaskItem
            }, {
                type: 'board',
                model: BoardItemBoard,
                method: self.createBoardItem
            }];

            let method = methods.find((method) => method.type === data.type);

            if (!method) {
                return reject(new Error('No right type to create BoardItem'));
            }

            let boardItem = {
                board: data.board,
                item: data.item,
                project: data.project
            };

            method.model.count(boardItem).exec().then((count) => {
                if (count) {
                    return reject(new Error('This BoardItem already exists'));
                }

                method.method(data.item, data.project, data.board)
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
                .then((item) => resolve(item))
                .catch((err) => reject(err));
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
                .then((item) => resolve(item))
                .catch((err) => reject(err));
        });
    };

    this.getItemsByOptions = function (options) {
        return new Promise(function (resolve, reject) {
            BoardItem
                .find(options)
                .populate('item')
                .lean()
                .exec()
                .then((boardItems) => resolve(boardItems))
                .catch((err) => reject(err))
        });
    };

};

module.exports = BoardItemService;