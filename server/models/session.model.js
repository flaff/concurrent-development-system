const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = {
    author: String,
    content: String,
    time: Number
};

const Event = {
    name: String,
    content: String,
    time: Number
};

const sessionSchema = new Schema({
    Messages: [Message],
    Events: [Event],
    CreateData: Date,
    Name: String
});

sessionSchema.pre('save', function(next) {
    let error = null;

    next(error);
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
