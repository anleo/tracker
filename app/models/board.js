module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    let BoardSchema = new Schema({
        title: {type: String, required: true},
        status: {type: String, default: ''},
        time: {type: Number, default: 0},
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        type: String,
        shared: [{type: Schema.Types.ObjectId, ref: 'User'}],
        project: {type: Schema.Types.ObjectId, ref: 'Task'},
        createdAt: {type: Date, default: Date.now, index: true},
        updatedAt: {type: Date, default: Date.now, index: true},
        priority: {type: Number, default: 5, index: true},
        pointCost:{type: Number, default: 0}
    });

    BoardSchema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    });

    return mongoose.model('Board', BoardSchema);
};