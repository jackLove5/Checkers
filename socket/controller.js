const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const User = mongoose.model('User');
const Challenge = mongoose.model('Challenge');
const CheckersGame = require('../public/CheckersGame');
const CheckersAi = require('../public/CheckersAi')
const Chance = require('chance');
const chance = new Chance();
require('dotenv').config();

const joinGame = (socket, io) => async ({id, color}) => {
    socket.join(id);
    const playerCount = io.sockets.adapter.rooms.get(id).size;

    if (playerCount > 2) {
        socket.leave(id);
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    let game;
    try {
        game = await Game.findById(id);
    } catch (err) {
        if (err.name == 'CastError') {
            io.to(socket.id).emit('badRequest');
            socket.leave(id);
            return;
        } else {
            io.to(socket.id).emit('serverError');
            return;
        }
    }

    if (!game) {
        socket.leave(id);
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    if (game.vsCpu && playerCount > 1) {
        socket.leave(id);
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    if (game.gameState === 'completed') {
        socket.leave(id);
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    if (game.gameState === 'in_progress') {

        socket.handshake.session.reload(async (err) => {

            if (!socket.handshake.session.games) {
                return socket.disconnect();
            }

            if (socket.handshake.session.games[id]) {
                const color = socket.handshake.session.games[id].color;

                let checkersGame = new CheckersGame();
                const completedMoves = game.moves || [];
                checkersGame.start();
                completedMoves.forEach(moveJSON => {
                    const move = JSON.parse(moveJSON);
                    const [src, dst] = move.shortNotation.split(/x|-/);
                    checkersGame.doMove(src, dst, move.longNotation);
                })

                io.in(id).emit('playerReconnect', {moveOptions: checkersGame.getPlayableMoves(), fen: checkersGame.getFen(), color})

                if (game.vsCpu && playerCount === 1 || !game.vsCpu && playerCount === 2) {
                    await Game.updateOne({_id: id}, {disconnectTime: ''});
                } else {
                    io.to(socket.id).emit('playerDisconnect', {disconnectTime: game.disconnectTime});
                }
            }
        });

    } else if (game.vsCpu && playerCount === 1) {
        const checkersGame = new CheckersGame();
        checkersGame.start();


        const moveOptions = checkersGame.getPlayableMoves();
        
        let playerColor;
        if (color === 'b' || color === 'w') {
            playerColor = color;
        } else {
            playerColor = chance.bool() ? 'b' : 'w';
        }

        const cpuColor = playerColor === 'b' ? 'w' : 'b';

        const playerUsername = socket.handshake.session.username || 'Guest';
        const user = User.findOne({username: playerUsername});
        const playerRating = user ? user.rating : 0;

        try {
            await Game.updateOne({_id: id}, {
                gameState: 'in_progress',
                playerBlack: cpuColor === 'b' ? 'Computer' : playerUsername,
                playerWhite: cpuColor === 'w' ? 'Computer' : playerUsername,
                playerBlackRating: cpuColor === 'b' ? 0 : playerRating,
                playerWhiteRating: cpuColor === 'w' ? 0 : playerRating
            });
        } catch (error) {
            io.to(socket.id).emit('serverError');
            return;
        }

        io.to(socket.id).emit('startGame', {moveOptions, color: playerColor});
        socket.handshake.session.reload((err) => {

            if (err) {
                return socket.disconnect();
            }

            socket.handshake.session.games[id] = {color: playerColor};
            socket.handshake.session.save();
        });
        
        if (cpuColor === 'b') {
            
            const ai = new CheckersAi(checkersGame);
            const [firstMove, v] = ai.getNextMove();

            try {
                await executeMoveAndNotify(io, firstMove, checkersGame, id);
            } catch (err) {
                io.to(socket.id).emit('serverError');
                return;
            }
        }
    } else if (!game.vsCpu && playerCount === 1) {
        socket.handshake.session.reload(async (err) => {

            if (err) {
                return socket.disconnect();
            }

            const username = socket.handshake.session.username;
            if (color !== 'b' && color !== 'w') {
                color = chance.bool() ? 'b' : 'w';
            }
            if (username) {
                if (game.playerBlack === username || game.playerWhite === username) {
                    color = game.playerBlack === username ? 'b' : 'w';
                } else {
                    const user = await User.findOne({username});
                    if (color === 'b') {
                        await Game.updateOne({_id: id}, {playerBlack: username, playerBlackRating: user ? user.rating : 0});
                    } else {
                        await Game.updateOne({_id: id}, {playerWhite: username, playerWhiteRating: user ? user.rating : 0});
                    }
                }
            }

            socket.handshake.session.games[id] = {color};
            socket.handshake.session.save();
        });
    } else if (!game.vsCpu && playerCount === 2) {

        const checkersGame = new CheckersGame();
        checkersGame.start();
        try {
            await Game.updateOne({_id: id}, {gameState: 'in_progress'});
        } catch (error) {
            io.to(socket.id).emit('serverError');
            return;
        }

        const moveOptions = checkersGame.getPlayableMoves();
        const p1SocketId = Array.from(io.sockets.adapter.rooms.get(id)).find(id => id !== socket.id);

        const player1Socket = io.sockets.sockets.get(p1SocketId);
        player1Socket.handshake.session.reload((err) => {
            if (err) {
                return socket.disconnect();
            }

            const p1Color = player1Socket.handshake.session.games[id].color;
            socket.handshake.session.reload(async (err) => {
                if (err) {
                    return socket.disconnect();
                }

                const p2Username = socket.handshake.session.username;
                const p2Color = p1Color === 'b' ? 'w' : 'b';
                if (p2Username) {
                    const p2User = await User.findOne({username: p2Username});
                    if (p2Color === 'b') {
                        await Game.updateOne({_id: id}, {playerBlack: p2Username, playerBlackRating: p2User ? p2User.rating : 0});
                    } else {
                        await Game.updateOne({_id: id}, {playerWhite: p2Username, playerWhiteRating: p2User ? p2User.rating : 0});
                    }
                }

                socket.handshake.session.games[id] = {color: p2Color};
                socket.handshake.session.save();
                io.to(p1SocketId).emit('startGame', {moveOptions, color: p1Color});
                io.to(socket.id).emit('startGame', {moveOptions, color: p2Color});
            })
        })
    }
}

const disconnecting = (socket, io) => async ({}) => {
    for (const roomId of socket.rooms) {
        if (roomId === socket.id) {
            continue;
        }

        let game;
        try {
            game = await Game.findByIdAndUpdate(roomId, {disconnectTime: String(Date.now())}, {new: true})
        } catch (err) {
            continue;
        }

        if (!game) {
            continue;
        }


        let playerCount = io.sockets.adapter.rooms.get(roomId) ? io.sockets.adapter.rooms.get(roomId).size : 0;
        if (playerCount === 0) {
            setTimeout(async () => {
                playerCount = io.sockets.adapter.rooms.get(roomId) ? io.sockets.adapter.rooms.get(roomId).size : 0;
                try {
                    game = await Game.findById(roomId);
                } catch (err) {
                    return;
                }

                if (playerCount === 0 && game.disconnectTime && Date.now() - parseInt(game.disconnectTime) >= 10000) {
                    await stopGameAndNotify(io, game._id, 'd', 'Both players left');
                }
            }, 10000);
        } else {
            io.to(roomId).emit('playerDisconnect', {disconnectTime: game.disconnectTime});
        }
    }
}

const executeMoveAndNotify = async (io, move, game, gameId) => {
    try {
        const [src, dst] = move.shortNotation.split(/x|-/);
        game.doMove(src, dst, move.longNotation);
        const updated = await Game.findOneAndUpdate({_id: gameId}, {$push: {moves: JSON.stringify(move)}}, {new: true});
        io.in(gameId).emit('move', {
            moveOptions: game.getPlayableMoves(),
            fen: game.getFen(),
            completedMoves: updated.moves.map(m => JSON.parse(m))
        });
    } catch (err) {
        throw err;
    }
}

const updateRatings = async (game) => {
    const playerBlack = await User.findOne({username: game.playerBlack});
    const playerWhite = await User.findOne({username: game.playerWhite});

    if (!playerBlack || !playerWhite) {
        return;
    }

    const pBlack = (1.0 / (1.0 + Math.pow(10, ((playerWhite.rating - playerBlack.rating) / 400))));
    const pWhite = (1.0 / (1.0 + Math.pow(10, ((playerBlack.rating - playerWhite.rating) / 400))));
    const k = 20;

    let blackResult, whiteResult;
    if (game.result === 'b') {
        blackResult = 1;
        whiteResult = 0;
    } else if (game.result === 'w') {
        blackResult = 0;
        whiteResult = 1;
    } else {
        blackResult = 0.5;
        whiteResult = 0.5;
    }

    const blackRating = Math.round(playerBlack.rating + k * (blackResult - pBlack));
    const whiteRating = Math.round(playerWhite.rating + k * (whiteResult - pWhite));

    await User.updateOne({_id: playerBlack._id}, {rating: blackRating});
    await User.updateOne({_id: playerWhite._id}, {rating: whiteRating});
}
const stopGameAndNotify = async (io, gameId, result, reason) => {
    try {
        let game = await Game.findById(gameId);
        if (!game || game.gameState !== 'in_progress')  {
            return;
        }

        game = await Game.findOneAndUpdate({_id: gameId}, {result, reason, gameState: 'completed'}, {new: true});
        if (game.isRanked) {
            await updateRatings(game);
        }
        io.in(gameId).emit('gameOver', {gameId, result, reason});


    } catch (err) {
        throw err;
    }
}
const makeMove = (socket, io) => async ({move, id}) => {
    let gameRecord;
    try {
        gameRecord = await Game.findById(id);
    } catch (err) {
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    if (!gameRecord) {
        io.to(socket.id).emit('badRequest', {});
        return;
    }

    let game = new CheckersGame();
    game.start();
    gameRecord.moves.forEach(moveJSON => {
        const move = JSON.parse(moveJSON);
        const [src, dst] = move.shortNotation.split(/x|-/);
        game.doMove(src, dst, move.longNotation);
    });

    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        const color = socket.handshake.session.games[id].color;
        if (!socket.handshake.session.games[id] || game.turn !== color) {
            io.to(socket.id).emit('badRequest', () => {});
            return;
        }

        if (gameRecord.drawOffered) {
            const drawOffered = gameRecord.drawOffered;
            await Game.updateOne({_id: id}, {drawOffered: ''});
            if (drawOffered !== game.turn) {
                io.to(id).emit('drawDeclined', {id, color});
            }
        }


        try {
            await executeMoveAndNotify(io, move, game, id);
        } catch (err) {
            io.to(socket.id).emit('badRequest', () => {});
            return;
        }

            
        const over = game.getWinner() || game.isDraw();
        if (over) {
            const result = game.isDraw() ? 'd' : game.getWinner();
            const reason = '';
            try {
                await stopGameAndNotify(io, id, result, reason);
            } catch (err) {
                io.to(id).emit('serverError', {});
            }
            return;
        }

        if (gameRecord.vsCpu) {
            const ai = new CheckersAi(game);
            const [move, v] = ai.getNextMove();

            try {
                await executeMoveAndNotify(io, move, game, id);
            } catch (err) {
                io.to(socket.id).emit('serverError');
                return;
            }

            const over = game.getWinner() || game.isDraw();

            if (over) {
                const result = game.isDraw() ? 'd' : game.getWinner();
                const reason = '';
                try {
                    await stopGameAndNotify(io, id, result, reason);
                } catch (err) {
                    io.to(id).emit('serverError', {});
                }
                return;
            }
        }
    })
    
};

const resign = (socket, io) =>  async ({id}) => {
    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        if (!socket.handshake.session.games || !socket.handshake.session.games[id]) {
            socket.emit('badRequest', {});
            return;
        }

        const color = socket.handshake.session.games[id].color;

        const result = color === 'b' ? 'w' : 'b';
        
        const reason = `${color === 'b' ? 'Black' : 'White'} resigned`;

        let game;
        try {
            game = await Game.findById(id);
        } catch (err) {
            io.to(id).emit('serverError', {});
        }

        if (!game || game.gameState !== 'in_progress') {
            socket.emit('badRequest', {});
            return;
        }

        try {
            await stopGameAndNotify(io, id, result, reason);
        } catch (err) {
            io.to(id).emit('serverError', {});
        }
    })

};

const offerDraw = (socket, io) =>  async ({id}) => {
    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        const color = socket.handshake.session.games[id].color;
        const game = await Game.findById(id);

        if (game.gameState !== 'in_progress') {
            io.to(socket.id).emit('badRequest', {});
            return;
        }

        if (game.drawOffered && game.drawOffered !== color) {
            try {
                await stopGameAndNotify(io, id, 'd', 'Mutual agreement');
            } catch (err) {
                io.to(id).emit('serverError', {});
            }
        } else if (!game.drawOffered)  {
            await Game.updateOne({_id: id}, {drawOffered: color});
            io.to(id).emit('offerDraw', {id, color});
        }

    })
};

const respondDraw = (socket, io) =>  async ({id, accept}) => {
    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        const color = socket.handshake.session.games[id].color;
        const game = await Game.findById(id);
        if (game.drawOffered && game.drawOffered !== color && accept) {

            try {
                await stopGameAndNotify(io, id, 'd', 'Mutual agreement');
            } catch (err) {
                io.to(id).emit('serverError', {});
            }
        } else if (game.drawOffered && game.drawOffered !== color) {
            await Game.updateOne({_id: id}, {drawOffered: ''});
            io.to(id).emit('drawDeclined', {id, color});
        }

    })
};

const claimWin = (socket, io) => async ({id}) => {
    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        if (!socket.handshake.session.games[id]) {
            io.to(id).emit('badRequest', {});
            return;
        }

        const color = socket.handshake.session.games[id].color;

        const game = await Game.findById(id);

        if (game && game.gameState === 'in_progress' && game.disconnectTime && Date.now() - parseInt(game.disconnectTime) >= 10000) {
            await stopGameAndNotify(io, id, color, 'Claimed win');
        } else {
            io.to(id).emit('badRequest', {});
        }
    })
}

const callDraw = (socket, io) => async ({id}) => {
    socket.handshake.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        if (!socket.handshake.session.games[id]) {
            io.to(id).emit('badRequest', {});
            return;
        }

        const game = await Game.findById(id);

        if (game && game.gameState === 'in_progress' && game.disconnectTime && Date.now() - parseInt(game.disconnectTime) >= 10000) {
            await stopGameAndNotify(io, id, 'd', 'Called draw');
        } else {
            io.to(id).emit('badRequest', {});
        }
    })
}

const createChallenge = (socket, io) => async ({receiverName, isRanked, color}) => {
    if (!socket.handshake.session || !socket.handshake.session.username) {
        socket.emit('badRequest', {});
        return;
    }

    const senderName = socket.handshake.session.username;

    if (receiverName === senderName) {
        socket.emit('badRequest', {});
        return;
    }

    const rooms = io.sockets.adapter.rooms;

    if (!rooms.get(receiverName) || rooms.get(receiverName).size == 0) {
        socket.emit('badRequest', {});
        return;
    }


    let senderColor;
    if (color === 'b' || color === 'w') {
        senderColor = color;
    } else {
        senderColor = chance.bool() ? 'b' : 'w';
    }

    let newChallenge;
    try {
        newChallenge = await Challenge.create({
            senderName,
            receiverName,
            playerBlack: senderColor === 'b' ? senderName : receiverName,
            playerWhite: senderColor === 'w' ? senderName : receiverName,
            isRanked
        });
    } catch (err) {
        if (err.name == 'CastError') {
            socket.emit('badRequest');
        } else {
            socket.emit('serverError');
        }

        return;
    }



    socket.join(`${newChallenge._id}`);


    io.to(receiverName).emit('challengeRequest', {challenge: newChallenge});

};

const respondToChallenge = (socket, io) => async ({challengeId, accept}) => {

    const rooms = io.sockets.adapter.rooms;


    if (!socket.handshake.session || !socket.handshake.session.username) {
        socket.emit('badRequest', {});
        return;
    }

    const username = socket.handshake.session.username;

    let challenge;
    try {
        challenge = await Challenge.findById(challengeId);
    } catch (err) {
        socket.emit('badRequest', {});
        return;
    }


    if (challenge.receiverName !== username) {
        socket.emit('badRequest', {});
        return;
    }

    if (challenge.status !== 'pending') {
        socket.emit('badRequest', {});
        return;
    }

    if (accept) {
        let newGame;
        try {
            const playerBlackUser = await User.findOne({username: challenge.playerBlack});
            const playerWhiteUser = await User.findOne({username: challenge.playerWhite});
            newGame = await Game.create({
                isRanked: challenge.isRanked,
                vsCpu: false,
                playerBlack: challenge.playerBlack,
                playerWhite: challenge.playerWhite,
                playerBlackRating: playerBlackUser ? playerBlackUser.rating : 0,
                playerWhiteRating: playerWhiteUser ? playerWhiteUser.rating : 0
            });
        } catch (err) {
            return;
        }

        await Challenge.updateOne({_id: challenge._id}, {status: 'accepted'});
        socket.join(`${challengeId}`);

        io.to(`${challengeId}`).emit('challengeStart', {gameId: newGame._id});
    } else {
        await Challenge.updateOne({_id: challenge._id}, {status: 'rejected'});
        io.to(`${challenge._id}`).emit('challengeRejected', {});
    }
}

module.exports = {joinGame, makeMove, resign, offerDraw, respondDraw, disconnecting, claimWin, callDraw, createChallenge, respondToChallenge};