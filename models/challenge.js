const mongoose = require('mongoose')

const challengeSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: [true, 'must provide senderName']
    },

    receiverName: {
        type: String,
        required: [true, 'must provide receiverName']
    },

    playerBlack: {
        type: String,
        required: [true, 'must provide playerBlack']
    },

    playerWhite: {
        type: String,
        required: [true, 'must provide playerWhite']
    },

    isRanked: {
        type: Boolean,
        required: [true, 'must provide isRanked']
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