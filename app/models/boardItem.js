module.exports = function (mongoose) {
    const Schema = mongoose.Schema;
    let options = {discriminatorKey: 'type'};

    let BoardItemSchema = new Schema({
        board: {type: Schema.Types.ObjectId, ref: 'Board'},
        createdAt: {type: Date, default: Date.now, index: true},
        updatedAt: {type: Date, default: Date.now, index: true}
    }, options);

    BoardItemSchema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    });

    return mongoose.model('BoardItem', BoardItemSchema);
};