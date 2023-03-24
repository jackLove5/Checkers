const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path');

const play = async (req, res) => {
    const gameId = req.params.id;
    let game;
    try {
        game = await Game.findById(gameId);
    } catch (err) {
        if (err.name == 'CastError') {
            res.status(404).send('');
            return;
        } else {
            res.status(500).send('');
            return;
        }
    }

    if (!game) {
        res.status(404).send('');
        return;
    }

    res.sendFile(path.resolve(__dirname, '../public/play.html'));
};

router.route('/:id').get(play);

module.exports = router