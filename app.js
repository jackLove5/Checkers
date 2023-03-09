const express = require('express')
const app = express()

const userRouter = require('./routes/user')
const gameRouter = require('./routes/game')
const challengeRouter = require('./routes/challenge')
const rankingsRouter = require('./routes/rankings')

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/game', gameRouter);
app.use('/api/challenge', challengeRouter);

module.exports = app;