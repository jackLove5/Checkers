const {createServer} = require('http');

const session = require('express-session')
require('dotenv').config();

const {joinGame, makeMove, resign, offerDraw} = require('./controller');

const setupSocketServer = (app) => {
    const server = createServer(app).listen();
    const io = require('socket.io')(server);
    
    io.engine.use(session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));

    io.on('connection', async (socket) => {
        socket.request.session.games = {};
        socket.request.session.save();
        socket.on('joinGame', joinGame(socket, io));
        socket.on('makeMove', makeMove(socket, io));
        socket.on('resign', resign(socket, io));
        socket.on('offerDraw', offerDraw(socket, io));
    });

    return {io, server};
}

module.exports = setupSocketServer;