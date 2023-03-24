const {joinGame, makeMove, resign, offerDraw, respondDraw, disconnecting, claimWin, callDraw} = require('./controller');

const setupSocketServer = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', async (socket) => {
        if (!socket.handshake.session.games) {
            socket.handshake.session.games = {};
            socket.handshake.session.save();
        }

        socket.on('joinGame', joinGame(socket, io));
        socket.on('makeMove', makeMove(socket, io));
        socket.on('resign', resign(socket, io));
        socket.on('offerDraw', offerDraw(socket, io));
        socket.on('respondDraw', respondDraw(socket, io));
        socket.on('disconnecting', disconnecting(socket, io));
        socket.on('claimWin', claimWin(socket, io));
        socket.on('callDraw', callDraw(socket, io));
    });

    server.on('listening', () => {
        let httpServer = server;
        console.log(`socket server started: http://[${server.address().address}]:${server.address().port}`)
    })

    return io;
}

module.exports = setupSocketServer;