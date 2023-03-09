const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
    opponentUsername: {
        type: String,
        required: [true, 'must provide opponent username']
    },

    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: '{{VALUE}} is not supported'
        },
        default: 'pending'
    }
})

module.exports = mongoose.model('Challenge', challengeSchema);