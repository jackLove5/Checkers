const Game = require('../models/Game')
//const Challenge = require('../models/Challenge')

/*
    createGameVsCpu() don't require auth

    request:
    {
        isRanked: true/ false
        vsCpu: true/false
    }


    response:
    {
        gameId:
    }
*/

const createGame = async (req, res) => {

    if (typeof req.body.isRanked !== 'boolean') {
        res.status(400).send('');
        return;
    }

    if (typeof req.body.vsCpu !== 'boolean') {
        res.status(400).send('')
        return;
    }

    const isRanked = req.body.isRanked;
    const vsCpu = req.body.vsCpu;
    let game;
    try {
        game = await Game.create({isRanked, vsCpu});
    } catch (error) {
        res.status(500).send('');
        return;
    }

    res.status(200).json({_id: game._id});
}

/*
const createGameFromChallenge = async (challengeId) => {
    const challenge = await Challenge.findOne({_id: challengeId});
    const game = await Game.create
}*/

/*
    createGameFromChallenge() internal api called by respondToChallenge which requires auth
*/
/*
    request:
    {
        challengeId:
    }

    response:
    {
        gameId:
    }
*/

const getGamesByUsername = async (req, res) => {

    const username = req.query.u;
    let list1, list2;
    try {
        list1 = await Game.find({playerBlack: username});
        list2 = await Game.find({playerWhite: username});
    } catch (error) {
        res.status(500).send('');
        return;
    }

    res.status(200).json({games: list1.concat(list2)});
}

const getGameById = async (req, res) => {
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

    res.status(200).json('');
}

module.exports = {createGame, getGamesByUsername, getGameById}