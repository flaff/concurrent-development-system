const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Login: String,
    Password: String,
    CreateData: Date
});

userSchema.pre('save', function(next) {
    let error = null;
    this.CreateData = new Date();

    next(error);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
