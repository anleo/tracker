module.exports = function (mongoose, BoardItem) {
    const Schema = mongoose.Schema;
    let options = {discriminatorKey: 'type'};

    let BoardItemTaskSchema = new mongoose.Schema(
        {
            item: {type: Schema.Types.ObjectId, ref: 'Task'},
        },
        options
    );

    return BoardItem.discriminator('complex', BoardItemTaskSchema);
};