const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path');
const cheerio = require('cheerio');


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


    const $ = cheerio.load(fs.readFileSync(path.resolve(__dirname, '../public/play.html'), {encoding : 'utf-8'}));

    if (req.session.username) {

        const profileButton = `<div onclick="window.location = '/profile?u=${req.session.username}'" id="profile", data-cy="profile">${req.session.username}</div>`;
        const logoutButton = `<div onclick="window.location = '/logout''" id="logout", data-cy="logout">Log out</div>`
        $('#navbar').append(profileButton);
        $('#navbar').append(logoutButton);

    } else {
        const signinButton = `<div onclick="window.location = '/login'" id="signin", data-cy="signin">Sign In</div>`;
        $('#navbar').append(signinButton);
    }

    res.status(200).send($.root().html());
};

router.route('/:id').get(play);

module.exports = router