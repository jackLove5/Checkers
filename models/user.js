const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'must provide username'],
        trim: true,
        minLength: [3, 'username cannot be fewer than 3 characters'],
        maxLength: [30, 'username cannot be more than 30 characters'],
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        minLength: [60, 'invalid password length'],
        maxLength: [60, 'invalid password length '],
        require: [true, 'must provide password']
    },

    rating: {
        type: Number,
        default: 1000
    }
});

module.exports = mongoose.model('User', userSchema);