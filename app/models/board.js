module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    let BoardSchema = new Schema({
        title: {type: String, required: true},
        status: String,
        time: {type: Number, default: 0},
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        shared: [{type: Schema.Types.ObjectId, ref: 'User'}],
        project: {type: Schema.Types.ObjectId, ref: 'Task'},
        createdAt: {type: Date, default: Date.now, index: true},
        updatedAt: {type: Date, default: Date.now, index: true}
    });

    BoardSchema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    });

    return mongoose.model('Board', BoardSchema);
};