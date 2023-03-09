const Challenge = require('../models/challenge')
const User = require('../models/user')

const createChallenge = async (req, res) => {
    const opponent = req.body.opponentUsername;
    if (typeof opponent !== 'string') {
        res.status(400).send('');
        return;
    }

    let opponentUser;
    try {
        opponentUser = await User.findOne({username: opponent});
    } catch (err) {
        res.status(500).send('');
        return;
    }

    if (opponentUser) {
        const challenge = await Challenge.create({opponentUsername: opponent});
        res.status(200).send('');
    } else {
        res.status(404).send('')
    }
}

const respondToChallenge = async (req, res) => {
    const {challengeId, accepted} = req.body;

    if (typeof challengeId !== 'string') {
        res.status(400).send('');
        return;
    }

    if (typeof accepted !== 'boolean') {
        res.status(400).send('');
        return;
    }

    let challenge;
    try {
        challenge = await Challenge.findOne({_id: challengeId});
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).send('');
        } else {
            res.status(500).send('');
        }

        return;
    }
    if (challenge) {

        const newStatus = accepted ? 'accepted' : 'rejected';
        await Challenge.updateOne({_id: challengeId}, {status: newStatus})
        
        res.status(200).send('');
    } else {
        res.status(404).send('');
    }
}

module.exports = {createChallenge, respondToChallenge};
