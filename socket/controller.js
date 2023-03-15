const Game = require('../models/game')
const {CheckersGame} = require('../src/CheckersGame');
const {CheckersAi} = require('../src/CheckersAi')
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

    if (game.vsCpu && playerCount === 1) {
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
        socket.request.session.reload((err) => {

            if (err) {
                return socket.disconnect();
            }

            socket.request.session.games[id] = {color: playerColor};
            socket.request.session.save();
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
        socket.request.session.reload((err) => {

            if (err) {
                return socket.disconnect();
            }
            if (color) {
                socket.request.session.games[id] = {color};

            } else {
                color = chance.bool() ? 'b' : 'w';
                socket.request.session.games[id] = {color};
            }
            socket.request.session.save();
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
        player1Socket.request.session.reload((err) => {
            if (err) {
                return socket.disconnect();
            }

            const p1Color = player1Socket.request.session.games[id].color;
            socket.request.session.reload((err) => {
                if (err) {
                    return socket.disconnect();
                }

                const p2Color = p1Color === 'b' ? 'w' : 'b';
                socket.request.session.games[id] = {color: p2Color};
                socket.request.session.save();
                io.to(p1SocketId).emit('startGame', {moveOptions, color: p1Color});
                io.to(socket.id).emit('startGame', {moveOptions, color: p2Color});
            })
        })
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
        io.to(gameId).emit('gameOver', {gameId});
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

    let game = new CheckersGame();
    game.start();
    gameRecord.moves.forEach(moveJSON => {
        const move = JSON.parse(moveJSON);
        const [src, dst] = move.shortNotation.split(/x|-/);
        game.doMove(src, dst, move.longNotation);
    })

    socket.request.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        if (game.turn !== socket.request.session.games[id].color) {
            io.to(socket.id).emit('badRequest', () => {});
            return;
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
    socket.request.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        const color = socket.request.session.games[id].color;
        const result = color === 'b' ? 'w' : 'b';
        
        const reason = `${color === 'b' ? 'Black' : 'White'} resigns`;
        try {
            await stopGameAndNotify(io, id, result, reason);
        } catch (err) {
            io.to(id).emit('serverError', {});
        }
    })

};

const offerDraw = (socket, io) =>  async ({id}) => {
    socket.request.session.reload(async (err) => {
        if (err) {
            return socket.disconnect();
        }

        const color = socket.request.session.games[id].color;
        const game = await Game.findById(id);
        if (game.drawOffered && game.drawOffered !== color) {

            try {
                await stopGameAndNotify(io, id, 'd', 'Draw by mutual agreement');
            } catch (err) {
                io.to(id).emit('serverError', {});
            }
        } else {
            await Game.updateOne({_id: id}, {drawOffered: color});
            io.to(id).emit('offerDraw', {id, color});
        }

    })
};


module.exports = {joinGame, makeMove, resign, offerDraw};