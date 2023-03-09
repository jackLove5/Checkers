const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    isRanked: {
        type: Boolean,
        require: [true, 'must provide isRanked (true/false)']
    },

    vsCpu: {
        type: Boolean,
        require: [true, 'must provide vsCpu (true/false)']
    },

    player1Name: {
        type: String,
        default: "Guest",
        minLength: [3, 'player1Name length must be at least 3 characters'],
        maxLength: [30, 'playerName length must not exceed 30 characters'],
    },

    player2Name: {
        type: String,
        default: "Guest",
        minLength: [3, 'player2Name length must be at least 3 characters'],
        maxLength: [30, 'player2Name length must not exceed 30 characters'],
    },

    gameState: {
        type: String,
        enum: {
            values: ['initialized', 'in_progress', 'completed'],
            message: '{{VALUE}} is not supported'
        },
        default: 'initialized'
    }
});

module.exports = mongoose.model('Game', gameSchema);