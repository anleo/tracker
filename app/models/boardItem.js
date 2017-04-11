module.exports = function (mongoose) {
    const Schema = mongoose.Schema;
    let options = {discriminatorKey: 'type'};

    let BoardItemSchema = new Schema({
        board: {type: Schema.Types.ObjectId, ref: 'Board'},
        project: {type: Schema.Types.ObjectId, ref: 'Task'},
        isRoot: {type: Boolean, default: false},
        createdAt: {type: Date, default: Date.now, index: true},
        updatedAt: {type: Date, default: Date.now, index: true}
    }, options);

    BoardItemSchema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    });

    return mongoose.model('BoardItem', BoardItemSchema);
};