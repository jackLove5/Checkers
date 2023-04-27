const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config();

const createUser = async (req, res) => {

    console.log(`${new Date().toLocaleString()} creating user. username: ${req.body.username}`);

    if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
        res.status(400).send('Username must be between 3 and 30 characters and consist of only letters, numbers, hyphens, and dashes');
        return;
    }

    if (!req.body.username.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
        res.status(400).send('Username must be between 3 and 30 characters and consist of only letters, numbers, hyphens, and dashes');
        return;
    }

    if (req.body.password.length < 8 || req.body.password.length > 50) {
        res.status(400).send('Password must be between 8 and 50 characters');
        return;
    }

    if (process.env.RESERVED_USERNAMES.includes(req.body.username)) {
        res.status(400).send('Username is not available');
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
            console.log(`${new Date().toLocaleString()} ${err}`);
            if (err && err.name === "MongoServerError" && err.code === 11000) {
                res.status(400).send('Username is not available');
            } else {
                res.status(500).send('');
            }

            return;
        }

        console.log(`${new Date().toLocaleString()} Account successfully created. username: ${req.body.username}`);


        req.session.username = req.body.username;
        req.session.save();

        res.status(200).send('');
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
        console.log(`${new Date().toLocaleString()} ${err}`);
        res.status(500).send('');
        return;
    }

    if (user) {
        const match = await bcrypt.compare(req.body.password.normalize(), user.password);
        if (match) {
            console.log(`${new Date().toLocaleString()} successful login for username: ${req.body.username}`);
            req.session.username = user.username;
            req.session.save();
            res.status(200).send('');
        } else {
            res.status(401).send('Invalid username or password');
            console.log(`${new Date().toLocaleString()} failed password attempt for username: ${req.body.username}`);
        }
    } else {
        res.status(401).send('Invalid username or password');
    }
}

const getUserByUsername = async (req, res) => {

    let user;
    try {
        user = await User.findOne({username: req.params.username});
    } catch (err) {
        console.log(`${new Date().toLocaleString()} ${err}`);
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
    console.log(`${new Date().toLocaleString()} logging out username: ${req.session.username}`);
    req.session.username = null;
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