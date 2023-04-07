const User = require('../models/user')
const bcrypt = require('bcrypt')


const createUser = async (req, res) => {

    if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
        res.status(400).send('');
        return;
    }

    if (!req.body.username.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
        res.status(400).send('');
        return;
    }

    if (req.body.password.length < 8 || req.body.password.length > 50) {
        res.status(400).send('');
        return;
    }

    const normalizedPassword = req.body.password.normalize();
    bcrypt.hash(normalizedPassword, 10, async (err, passwordHash) => {
        if (err) {
            res.status(500).send('');
            return;
        }

        try {
            await User.create({
                username: req.body.username.toLowerCase(),
                password: passwordHash
            });
        } catch (err) {
            let statusCode;
            if (err && err.name === "MongoServerError" && err.code === 11000) {
                statusCode = 400;
            } else {
                statusCode = 500;
            }

            res.status(statusCode).send('');
            return;
        }


        res.status(200).send('');
        req.session.username = req.body.username;
        req.session.save();
    });
}

const authenticateUser = async (req, res) => {

    if (!req.body.username || typeof req.body.username !== 'string') {
        res.status(400).send('');
        return;
    }

    if (!req.body.password || typeof req.body.password !== 'string') {
        res.status(400).send('');
        return;
    }

    let user;
    try {
        user = await User.findOne({username: req.body.username.toLowerCase()});
    } catch (err) {
        res.status(500).send('');
        return;
    }

    if (user) {
        const match = await bcrypt.compare(req.body.password.normalize(), user.password);
        if (match) {
            res.status(200).send('');
            req.session.username = user.username;
            req.session.save();
        } else {
            res.status(401).send('');
        }
    } else {
        res.status(401).send('');
    }
}

const getUserByUsername = async (req, res) => {

    let user;
    try {
        user = await User.findOne({username: req.params.username});
    } catch (err) {
        res.status(500).send('');
        return;
    }

    if (user) {
        res.status(200).json({username: user.username, rating: user.rating});
    } else {
        res.status(404).send('');
    }
}

const logout = (req, res, next) => {
    req.session.user = null;
    req.session.save((err) => {
        if (err) {
            next(err);
        }

        req.session.regenerate((err) => {
            if (err) {
                next(err);
            }
            res.redirect('/');
        })
    })
}

module.exports = {createUser, authenticateUser, getUserByUsername, logout}