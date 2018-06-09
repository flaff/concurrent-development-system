const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = {
    author: String,
    content: String,
    time: Number,
    type: String
};

const sessionSchema = new Schema({
    Messages: [Schema.Types.Mixed],
    CreateDate: Date,
    Name: String
});

sessionSchema.pre('save', function (next) {
    let error = null;
    this.CreateDate = new Date();
    next(error);
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
