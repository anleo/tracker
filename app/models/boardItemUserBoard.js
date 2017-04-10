module.exports = function (mongoose, BoardItem) {
    const Schema = mongoose.Schema;
    let options = {discriminatorKey: 'type'};

    let BoardItemUserBoardSchema = new mongoose.Schema(
        {
            item: {type: Schema.Types.ObjectId, ref: 'Board'},
            owner: {type: Schema.Types.ObjectId, ref: "User"}
        },
        options
    );

    return BoardItem.discriminator('userBoard', BoardItemUserBoardSchema);
};