const mongoose = require('mongoose');
const Game = mongoose.model('Game');
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
        try {
            await Game.updateOne({_id: id}, {gameState: 'in_progress'});
        } catch (error) {
            io.to(socket.id).emit('serverError');
            return;
        }

        const moveOptions = checkersGame.getPlayableMoves();
        
        let playerColor;
        if (color === 'b' || color === 'w') {
            playerColor = color;
        } else {
            playerColor = chance.bool() ? 'b' : 'w';
        }

        const cpuColor = playerColor === 'b' ? 'w' : 'b';

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
        socket.handshake.session.reload((err) => {

            if (err) {
                return socket.disconnect();
            }
            if (color) {
                socket.handshake.session.games[id] = {color};

            } else {
                color = chance.bool() ? 'b' : 'w';
                socket.handshake.session.games[id] = {color};
            }
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
            socket.handshake.session.reload((err) => {
                if (err) {
                    return socket.disconnect();
                }

                const p2Color = p1Color === 'b' ? 'w' : 'b';
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
            return;
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

const stopGameAndNotify = async (io, gameId, result, reason) => {
    try {
        await Game.updateOne({_id: gameId}, {result, reason, gameState: 'completed'});
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
    })

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

        const color = socket.handshake.session.games[id].color;

        const game = await Game.findById(id);

        if (game && game.disconnectTime && Date.now() - parseInt(game.disconnectTime) >= 10000) {
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

        const game = await Game.findById(id);

        if (game && game.disconnectTime && Date.now() - parseInt(game.disconnectTime) >= 10000) {
            await stopGameAndNotify(io, id, 'd', 'Called draw');
        } else {
            io.to(id).emit('badRequest', {});
        }
    })
}

module.exports = {joinGame, makeMove, resign, offerDraw, respondDraw, disconnecting, claimWin, callDraw};