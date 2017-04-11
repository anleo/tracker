module.exports = function (mongoose, BoardItem) {
    const Schema = mongoose.Schema;
    let options = {discriminatorKey: 'type'};

    let BoardItemBoardSchema = new mongoose.Schema(
        {
            item: {type: Schema.Types.ObjectId, ref: 'Board'}
        },
        options
    );

    return BoardItem.discriminator('board', BoardItemBoardSchema);
};