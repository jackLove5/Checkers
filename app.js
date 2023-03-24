const express = require('express')
const session = require('express-session')
const app = express()
require('dotenv').config();

const userRouter = require('./routes/user')
const gameRouter = require('./routes/game')
const challengeRouter = require('./routes/challenge')
const rankingsRouter = require('./routes/rankings')
const playRouter = require('./routes/play');

const sessionMiddleware = session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/game', gameRouter);
app.use('/api/challenge', challengeRouter);
app.use('/play', playRouter);
app.use(express.static('./public'));

module.exports = {app, sessionMiddleware};