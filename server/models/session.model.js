const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    Messages: [],
    CreateData: Date
});

sessionSchema.pre('save', function(next) {
    let error = null;
    this.CreateData = new Date();

    next(error);
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
