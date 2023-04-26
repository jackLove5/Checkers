const {joinGame, makeMove, resign, offerDraw, respondDraw, disconnecting, claimWin, callDraw, createChallenge, respondToChallenge} = require('./controller');

const setupSocketServer = (server) => {
    const io = require('socket.io')(server);


    io.on('connection', async (socket) => {
        console.log(`${new Date().toLocaleString()} received socket connection`);
        if (!socket.handshake.session.games) {
            socket.handshake.session.games = {};
            socket.handshake.session.save();
        }

        if (socket.handshake.session && socket.handshake.session.username) {
            socket.join(socket.handshake.session.username);
            socket.join("*loggedIn");
        }

        console.log(`${new Date().toLocaleString()} registering socket event handlers`);


        socket.on('joinGame', joinGame(socket, io));
        socket.on('makeMove', makeMove(socket, io));
        socket.on('resign', resign(socket, io));
        socket.on('offerDraw', offerDraw(socket, io));
        socket.on('respondDraw', respondDraw(socket, io));
        socket.on('disconnecting', disconnecting(socket, io));
        socket.on('claimWin', claimWin(socket, io));
        socket.on('callDraw', callDraw(socket, io));

        socket.on('createChallenge', createChallenge(socket, io));
        socket.on('respondToChallenge', respondToChallenge(socket, io));

        let usernames = [];
        if (io.sockets.adapter.rooms.get('*loggedIn')) {
            usernames = Array.from(io.sockets.adapter.rooms.get('*loggedIn'))
                .map(socketId => io.sockets.sockets.get(socketId))
                .map(socket => socket.handshake.session.username);
        }

        console.log(`${new Date().toLocaleString()} emitting onlineUsers`);


        io.emit('onlineUsers', {usernames});
    });

    server.on('listening', () => {
        console.log(`socket server started: http://[${server.address().address}]:${server.address().port}`)
    })

    return io;
}

module.exports = setupSocketServer;