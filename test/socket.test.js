/*
    Using boilerplate written by Tomasz Zwierzchoń
    https://medium.com/@tozwierz/testing-socket-io-with-jest-on-backend-node-js-f71f7ec7010f
*/


const {app, sessionMiddleware} = require('../app')
const io = require('socket.io-client')
const setupSocketServer = require('../socket/setup')

const Game = require('../models/game')
const User = require('../models/user')
const Chance = require('chance');
const chance = new Chance();
const Challenge = require('../models/challenge')
const connectDB = require('../db/connect')
require('dotenv').config();
const sharedsession = require('express-socket.io-session');
const http = require('http');

let player1Socket;
let player2Socket;
let player3Socket;
let httpServer;
let httpServerAddr;
let ioServer;
let db;

beforeAll((done) => {

    const server = http.createServer(app);
    const io = setupSocketServer(server);
    
    io.use(sharedsession(sessionMiddleware, {autoSave: true}));

    ioServer = io;
    httpServer = server;
    server.listen(process.env.PORT);
    httpServerAddr = httpServer.address();
    done();
})

afterAll((done) => {
    ioServer.close();
    httpServer.close();
    done();
});

beforeEach((done) => {
    let numConnected = 0;
    connectDB(process.env.MONGO_URI_TEST).then(database => {
        db = database;

        player1Socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
            withCredentials: true
        });

        player1Socket.once('connect', () => {
            numConnected++;
            if (numConnected == 3) {
                done();
            }
        });

        player2Socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
            withCredentials: true
        });

        player2Socket.once('connect', () => {
            numConnected++;
            if (numConnected == 3) {
                done();
            }
        })


        player3Socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
            withCredentials: true
        });

        player3Socket.once('connect', () => {
            numConnected++;
            if (numConnected == 3) {
                done();
            }
        })
    });
})

afterEach(async () => {
    if (db.connection.readyState !== 0) {
        await db.disconnect();
    }

    if (player1Socket.connected) {
        player1Socket.disconnect();
    }

    if (player2Socket.connected) {
        player2Socket.disconnect();
    }

    if (player3Socket.connected) {
        player3Socket.disconnect();
    }
})

afterAll(async () => {
    db = await connectDB(process.env.MONGO_URI_TEST);
    await Game.deleteMany({});
    await db.disconnect();
})

describe('joinGame', () => {

    test('should emit startGame event when 2 users join the game room', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                done();
            })
        })
    });

    test('If vsCpu is true, should emit startGame event when 1 user joins the game room', (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                done();
            })
        })
    });

    test('should emit badRequest event when game id is invalid', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = 14;
            player1Socket.emit('joinGame', {id});

            player1Socket.on('badRequest', () => {
                done();
            })
        })
    });


    test('if vsCpu is true, should emit badRequest when a second socket tries to join the game', (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                player2Socket.emit('joinGame', {id});
                player2Socket.on('badRequest', () => {
                    done();
                })
            })
        })
    });

    test('should emit badRequest when a third socket tries to join the game', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                player3Socket.emit('joinGame', {id});
                player3Socket.on('badRequest', () => {
                    done();
                });
            })
        })
    });

    test('should emit serverError event when database is unavailable', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            db.disconnect();
            const id = game._id;
            player1Socket.emit('joinGame', {id});

            player1Socket.on('serverError', () => {
                done();
            })
        })
    });

    test('first player who joined should be assigned their preferred color', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            const color = 'b';
            let player1Assigned = false;
            let player2Assigned = false;
            player1Socket.emit('joinGame', {id, color});

            setTimeout(() => player2Socket.emit('joinGame', {id, color}), 500);

            player1Socket.once('startGame', ({color}) => {
                expect(color).toBe('b');
                if (player2Assigned) {
                    done();
                }

                player1Assigned = true;
            });

            player2Socket.once('startGame', ({color}) => {
                expect(color).toBe('w');
                if (player1Assigned) {
                    done();
                }

                player2Assigned = true;
            })


        })
    });

    test('should emit badRequest if game is in completed state', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                player1Socket.emit('resign', {id});
                player1Socket.on('gameOver', () => {
                    player1Socket.emit('joinGame', {id});
                    player1Socket.on('badRequest', () => {
                        done();
                    })
                })
            })
        })
    });
});

describe('startGame', () => {
    test('startGame event should send move options to client', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                expect(moveOptions).toBeTruthy();
                done();
            })
        })
    });

    test('startGame event should send player color to clients', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            let player1Color = '';
            let player2Color = '';
            player1Socket.on('startGame', ({color}) => {

                expect(color).toBeTruthy();
                player1Color = color;
                if (player2Color) {
                    expect(player2Color).not.toBe(player1Color);
                    done();
                }
            });

            player2Socket.on('startGame', ({color}) => {
                expect(color).toBeTruthy();
                player2Color = color;
                if (player1Color) {
                    expect(player1Color).not.toBe(player2Color);
                    done();
                }
            })
        })
    });

    test('gameState should be set to in_progress when startGame event is emitted', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', () => {
                Game.findById(id).then(updatedGame => {
                    expect(updatedGame.gameState).toBe('in_progress');
                    done();
                })
            });
        })
    });
})

describe('makeMove', () => {
    test("server should emit 'move' event after performing valid move", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});


            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player1Socket.on('move', () => {
                    done();
                });
                player1Socket.emit('makeMove', {move, id});
            });
        });
    });

    test('should emit badRequest if player with white pieces moves first', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});


            player2Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player2Socket.emit('makeMove', {move, id});
                player2Socket.on('badRequest', () => {
                    done();
                })
            })
        });
    });

    test("server should emit badRequest if id is undefined", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});


            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player1Socket.emit('makeMove', {move});
                player1Socket.on('badRequest', () => {
                    done();
                })
            });
        });
    });


    test("(player has black pieces) if vsCpu is true, server should emit move event w/ ai move after performing valid player move", (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            const playerColor = 'b';
            player1Socket.emit('joinGame', {id, color: playerColor});

            player1Socket.on('startGame', ({moveOptions, color}) => {
                const move = moveOptions[0];
                expect(color).toBe(playerColor);
                player1Socket.emit('makeMove', {move, id});
                player1Socket.once('move', () => {
                    player1Socket.on('move', ({completedMoves}) => {
                        expect(completedMoves.length).toBe(2);
                        done();
                    })
                });
            });
        });
    });

    test("(player has white pieces) if vsCpu is true, server should emit move event w/ ai move after performing valid player move", (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            const color = 'w';
            player1Socket.emit('joinGame', {id, color});

            player1Socket.on('startGame', ({}) => {
                player1Socket.once('move', ({completedMoves, moveOptions}) => {
                    const move = moveOptions[0];
                    player1Socket.emit('makeMove', {move, id});
                    player1Socket.once('move', () => {
                        player1Socket.on('move', ({completedMoves}) => {
                            expect(completedMoves.length).toBe(3);
                            done();
                        })
                    })
                });
            });
        });
    });

    test("server should send next move options after performing valid move", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});


            player1Socket.on('startGame', ({moveOptions}) => {
                const oldMoveOptions = moveOptions;
                const move = moveOptions[0];
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('move', ({moveOptions}) => {
                    expect(moveOptions).toBeTruthy();
                    expect(moveOptions).not.toEqual(oldMoveOptions);
                    done();
                })
            });
        });
    });

    test("move should be added to database after completion", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('move', ({moveOptions}) => {
                    Game.findById(id).then(updatedGame => {
                        expect(updatedGame.moves.length).toBe(game.moves.length + 1);
                        done();
                    })
                })
            });
        });
    });

    test("should emit badRequest event when move is invalid", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                const move = {};
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('badRequest', () => {
                    done();
                });
            });
        });
    });

    test("should emit badRequest event when game id is invalid", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                const move = {};
                player1Socket.emit('makeMove', {move, id: 14});
                player1Socket.on('badRequest', () => {
                    done();
                });
            });
        });
    });

    test("response should contain fen of current state of the board", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('move', ({fen, moveOptions}) => {
                    expect(fen).toBeTruthy();
                    done();
                })
            });
        });
    });

    test("response should contain list of moves that have been played", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('move', ({fen, completedMoves, moveOptions}) => {
                    expect(completedMoves).toBeTruthy();
                    done();
                })
            });
        });
    })

    test("server should emit gameover when no more moves can be played", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            let p1LastMove = null;
            let p2LastMove = null;
            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                p1LastMove = move;
                player1Socket.emit('makeMove', {move, id});
            });

            player1Socket.on('move', ({moveOptions, completedMoves}) => {
                if (p1LastMove && completedMoves.at(-1).longNotation === p1LastMove.longNotation) {
                    return;
                }

                const move = moveOptions[0];
                p1LastMove = move;
                player1Socket.emit('makeMove', {move, id});
            })

            player2Socket.on('move', ({moveOptions, completedMoves}) => {
                if (p2LastMove && completedMoves.at(-1).longNotation === p2LastMove.longNotation) {
                    return;
                }

                const move = moveOptions[0];
                p2LastMove = move;
                player2Socket.emit('makeMove', {move, id});
            })

            player1Socket.on('gameOver', () => done());
        });
    })

    test.skip("(Vs CPU) server should emit gameover when no more moves can be played", (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});

            let p1LastMove = null;
            player1Socket.on('startGame', ({moveOptions}) => {
                const move = moveOptions[0];
                p1LastMove = move;
                player1Socket.emit('makeMove', {move, id});
            });

            player1Socket.on('move', ({moveOptions, completedMoves}) => {
                if (p1LastMove && completedMoves.at(-1).longNotation === p1LastMove.longNotation) {
                    return;
                }

                const move = moveOptions[0];
                p1LastMove = move;
                player1Socket.emit('makeMove', {move, id});
            })

            player1Socket.on('gameOver', () => done());
        });
    }, 60000)

});

describe('resign', () => {
    test('should emit gameOver event when player resigns', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.emit('resign', {id});

                let notifiedCount = 0;
                player1Socket.on('gameOver', () => {
                    notifiedCount++;
                    if (notifiedCount == 2) {
                        done();
                    }
                });

                player2Socket.on('gameOver', () => {
                    notifiedCount++;
                    if (notifiedCount == 2) {
                        done();
                    }
                });
            });
        });
    });

    test('game should be marked completed in database after gameOver event is emitted', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.emit('resign', {id});
                player1Socket.on('gameOver', () => {
                    Game.findById(id).then(updatedGame => {
                        expect(updatedGame.gameState).toBe('completed');
                        done();
                    })
                });
            });
        });
    });

    test('server should emit badRequest if player resigns when game is already over', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.emit('offerDraw', {id});
                player2Socket.on('offerDraw', () => {
                    player2Socket.emit('offerDraw', {id});
                    player1Socket.on('gameOver', () => {
                        player1Socket.emit('resign', {id});
                        player1Socket.on('badRequest', () => {
                            done();
                        })
                    });
                })

            });
        });
    });

    test('server should emit badRequest if player resigns before game has started ', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            setTimeout(() => {
                player1Socket.emit('resign', {id});
            }, 500);

            player1Socket.on('badRequest', () => {
                Game.findById(id).then(updatedGame => {
                    expect(updatedGame.gameState).toBe('initialized');
                    done();
                });
            })
        });
    })

    test('server should emit badRequest if outisde player resigns the game', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                player3Socket.emit('resign', {id});
                player3Socket.on('badRequest', () => {
                    done();
                })
            });
        });
    });
})

describe('gameOver', () => {
    test('result should be updated in database after gameOver event is emitted', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({color}) => {
                const player2Color = color === 'b' ? 'w' : 'b';
                player1Socket.emit('resign', {id});
                player1Socket.on('gameOver', () => {
                    Game.findById(id).then(updatedGame => {
                        expect(updatedGame.result).toBe(player2Color);
                        done();
                    });
                });
            });
        });
    });
});

describe('offerDraw', () => {
    test("server should emit offerDraw event to both players when client emits offerDraw event", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({}) => {
                player1Socket.emit('offerDraw', {id});
                player2Socket.on('offerDraw', () => {
                    done();
                })
            });
        });
    });

    test("server emitted offerDraw event should include color of player who offered draw", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({}) => {
                player1Socket.emit('offerDraw', {id});
                player2Socket.on('offerDraw', ({color}) => {
                    expect(color).toBe('b');
                    done();
                })
            });
        });
    });

    test("server should not emit offerDraw if player has already offered draw", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color : 'b'});
            player2Socket.emit('joinGame', {id});

            let responseCount = 0;
            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.on('offerDraw', () => {
                    responseCount++;
                });

                player1Socket.emit('offerDraw', {id});
                player1Socket.once('offerDraw', () => {
                    player1Socket.emit('offerDraw', {id});
                    player1Socket.emit('makeMove', {move: moveOptions[0], id});
                    player1Socket.on('move', () => {
                        expect(responseCount).toBe(1);
                        done();
                    })

                })
            });
        });
    });

    test("server should emit gameOver event when both players offer draw", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({}) => {
                player1Socket.emit('offerDraw', {id});
                setTimeout(() => {
                    player2Socket.emit('offerDraw', {id});
                    player2Socket.on('gameOver', () => {
                        done();
                    })
                }, 100);

            });
        });
    });

    test("server should emit gameOver event when player accepts draw", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({}) => {
                player1Socket.emit('offerDraw', {id});
                setTimeout(() => {
                    player2Socket.emit('respondDraw', {id, accept: true});
                    player2Socket.on('gameOver', () => {
                        done();
                    })
                }, 100);

            });
        });
    });

    test("server should emit drawDeclined event to both players when player declines draw offer", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({}) => {
                player1Socket.emit('offerDraw', {id});
                setTimeout(() => {
                    player2Socket.emit('respondDraw', {id, accept: false});
                    let player1Notified = false;
                    let player2Notified = false;
                    player1Socket.on('drawDeclined', ({color}) => {
                        player1Notified = true;
                        expect(color).toBeTruthy();
                        if (player2Notified) {
                            done();
                        }
                    })

                    player2Socket.on('drawDeclined', ({color}) => {
                        player2Notified = true;
                        expect(color).toBeTruthy();
                        if (player1Notified) {
                            done();
                        }
                    })
                }, 100);

            });
        });
    });

    test("making a move should withdraw player's own draw offer", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            let gameOver = false;
            let drawDeclined = false;
            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.emit('offerDraw', {id});
                player1Socket.once('offerDraw', () => {
                    player1Socket.emit('makeMove', {move: moveOptions[0], id})
                })

                player2Socket.on('move', () => {
                    player2Socket.emit('respondDraw', {id, accept: true});
                })

                player2Socket.on('gameOver', () => {
                    gameOver = true;
                });

                player2Socket.on('drawDeclined', ({color}) => {
                    drawDeclined = true;
                });

                setTimeout(() => {
                    expect(gameOver).toBe(false);
                    expect(drawDeclined).toBe(false);
                    done();
                }, 1000);

            });
        });
    });

    test("making a move should decline and withdraw other player's draw offer", (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});

            let gameOver = false;
            let drawDeclined = false;
            player1Socket.on('startGame', ({moveOptions, color}) => {
                player2Socket.emit('offerDraw', {id});

                player1Socket.once('offerDraw', () => {
                    player1Socket.emit('makeMove', {move: moveOptions[0], id});
                });

                player1Socket.once('move',() => {
                    player1Socket.emit('offerDraw', {id});
                });

                
                player1Socket.on('gameOver', () => {
                    gameOver = true;
                });

                player2Socket.on('drawDeclined', ({color}) => {
                    expect(color).toBe('b');
                    expect(gameOver).toBe(false);
                    done();
                });
            });
        });
    });

    test('server should emit badRequest if player offers draw when game is already over', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id});
            player2Socket.emit('joinGame', {id});

            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.emit('offerDraw', {id});
                player2Socket.on('offerDraw', () => {
                    player2Socket.emit('offerDraw', {id});
                    player1Socket.on('gameOver', () => {
                        player1Socket.emit('offerDraw', {id});
                        player1Socket.on('badRequest', () => {
                            done();
                        })
                    });
                })

            });
        });
    });

});

describe('disconnect', () => {
    test('Game should end in a draw after 10 seconds if both players disconnect', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.disconnect();
                player2Socket.disconnect();
                setTimeout(() => {
                    Game.findById(id).then(updatedGame => {
                        expect(updatedGame.result).toBe('d');
                        done();
                    })
                }, 11000);
            });
        });
    }, 15000);

    test('should auto resign after 10 seconds if player disconnects from cpu game', (done) => {
        Game.create({isRanked: false, vsCpu: true}).then(game => {
            const id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
    
            player1Socket.on('startGame', ({moveOptions}) => {
                player1Socket.disconnect();
                setTimeout(() => {
                    Game.findById(id).then(updatedGame => {
                        expect(updatedGame.result).toBe('w');
                        done();
                    })
                }, 11000);
            });
        });
    }, 15000);

    test('should emit playerDisconnect event when player disconnects', (done) => {
        const startTime = Date.now();
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            let id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({moveOptions}) => {
                player2Socket.disconnect();

                player1Socket.on('playerDisconnect', ({disconnectTime}) => {
                    expect(parseInt(disconnectTime)).toBeGreaterThan(startTime);
                    expect(parseInt(disconnectTime)).toBeLessThan(Date.now());
                    done();
                })
            });
        });
    });

    test('player 2 can claim win 10 seconds after player 1 disconnects', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            let id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({moveOptions}) => {
                player2Socket.disconnect();
            });

            player1Socket.on('playerDisconnect', () => {
                Game.updateOne({_id: id}, {disconnectTime: Date.now() - 10000}).then(game => {
                    player1Socket.emit('claimWin', {id})
                })
            });

            player1Socket.on('gameOver', ({result}) => {
                expect(result).toBe('b');
                done();
            });
        });
    });

    test('player 2 can call draw 10 seconds after player 1 disconnects', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            let id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({moveOptions}) => {
                player2Socket.disconnect();
            });

            player1Socket.on('playerDisconnect', () => {
                Game.updateOne({_id: id}, {disconnectTime: Date.now() - 10000}).then(game => {
                    player1Socket.emit('callDraw', {id})
                })
            });

            player1Socket.on('gameOver', ({result}) => {
                expect(result).toBe('d');
                done();
            });
        });
    });

    test('server should emit playerReconnect event when player reconnects', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            let id = game._id;

            ioServer.once('connect', (socket) => {
                socket.handshake.session.games = {};
                socket.handshake.session.games[id] = {color: 'w'}
            });

            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({}) => {
                player2Socket.disconnect();
            });

            player1Socket.once('playerDisconnect', () => {
                player2Socket.connect();

                player2Socket.once('connect', () => {
                    player2Socket.emit('joinGame', {id});
                })
                player2Socket.on('playerReconnect', () => {
                    done();
                })
            });
            
        });
    });
    test('server should emit badRequest if player claims win after opponent reconnects', (done) => {
        Game.create({isRanked: false, vsCpu: false}).then(game => {
            let id = game._id;
            player1Socket.emit('joinGame', {id, color: 'b'});
            player2Socket.emit('joinGame', {id});
    
            player1Socket.on('startGame', ({}) => {
                player2Socket.disconnect(true);
            });

            player1Socket.once('playerDisconnect', () => {
                Game.updateOne({_id: id}, {disconnectTime: Date.now() - 10000}).then(game => {
                    ioServer.once('connect', (socket) => {
                        socket.handshake.session.games = {};
                        socket.handshake.session.games[id] = {color: 'w'}
                    });

                    player2Socket.connect();

                    player2Socket.once('connect', () => {
                      player2Socket.emit('joinGame', {id});
                    });

                    player2Socket.on('playerReconnect', () => {
                       player1Socket.emit('claimWin', {id});
                       player1Socket.on('badRequest', () => {
                            done();
                       })
                    });
                })
            });
        });
    });
});

describe('createChallenge', () => {
    it('should emit badRequest if issuer is not logged in', (done) => {
        player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
        player1Socket.on('badRequest', () => {
            done();
        })

    });

    it('should emit badRequest if opponent is not logged in', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';
        });

        player1Socket.connect();

        player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
        player1Socket.on('badRequest', () => {
            done();
        });

    });

    it('should emit challengeRequest to opponent socket', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();


        player2Socket.on('challengeRequest', ({challenge}) => {
            expect(challenge).toBeTruthy();
            expect(challenge.senderName).toBe('player1Name');
            expect(challenge.receiverName).toBe('player2Name');
            expect(challenge.isRanked).toBeFalsy;
            expect(challenge.playerBlack).toBe('player1Name');
            expect(challenge.playerWhite).toBe('player2Name');
            expect(challenge._id).toBeTruthy();
            done();
        });
    });

    it('should emit server error when db connection is unavailable', (done) => {

        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                db.disconnect();
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();



        player1Socket.on('serverError', () => {
            done();
        })
    });

    it('should emit badRequest if user challenges themselves', (done) => {

        player1Socket.disconnect();
        player1Socket.connect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player1Socket.emit('createChallenge', {receiverName: 'player1Name', isRanked: false, color: 'b'});
            player1Socket.on('badRequest', () => {
                done();
            })

        });
    });
});

describe('respondToChallenge', () => {
    it('should emit badRequest if user is not logged in', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name';
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.disconnect();
            player2Socket.connect();
            ioServer.once('connect', (socket) => {
                player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
                player2Socket.on('badRequest', () => {
                    done();
                });
            })
        });
    });

    it("should emit badRequest if responder is not the requested opponent", (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player3Socket.disconnect();
                ioServer.once('connect', (socket => {
                    socket.handshake.session.username = 'player3Name'
                    player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
                }))
                player3Socket.connect();
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player3Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
            player3Socket.on('badRequest', () => {
                done();
            })
        });
    });

    it('should emit badRequest if challengeId is invalid', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: 'abc', accept: true}));
            player2Socket.on('badRequest', () => {
                done();
            });
        });
    });

    it('If accepted, server should emit challengeStart event to both players', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';
            socket.join('player1Name');
            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
            let player1Notified = false;
            let player2Notified = false;
            player2Socket.on('challengeStart', ({gameId}) => {
                player2Notified = true;
                expect(gameId).toBeTruthy();
                if (player1Notified) {
                    done();
                }
            });

            player1Socket.on('challengeStart', ({gameId}) => {
                player1Notified = true;
                expect(gameId).toBeTruthy();
                if (player2Notified) {
                    done();
                }
            })
        });

    });

    it('If accepted, challenge should be marked accepted in db', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
            player2Socket.on('challengeStart', ({gameId}) => {
                Challenge.findById(challenge._id).then(updated => {
                    expect(updated.status).toBe('accepted');
                    done();
                })
            });
        });

    });


    it('If rejected, server should emit challengeRejected event to sender', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: false}));
            player1Socket.on('challengeRejected', () => {
                done();
            });
        });

    });

    it('If rejected, challenge should be marked rejected in db', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: false}));
            player1Socket.on('challengeRejected', () => {
                Challenge.findById(challenge._id).then(challengeEntry => {
                    expect(challengeEntry.status).toBe('rejected');
                    done();
                });
            });
        });

    });

    it('should emit badRequest if challenge is not pending', (done) => {
        player1Socket.disconnect();
        ioServer.once('connect', (socket) => {
            socket.handshake.session.username = 'player1Name';

            player2Socket.disconnect();
            ioServer.once('connect', (socket) => {
                socket.handshake.session.username = 'player2Name'
                socket.join('player2Name');
                player1Socket.emit('createChallenge', {receiverName: 'player2Name', isRanked: false, color : 'b'});
            });
            player2Socket.connect();
        });

        player1Socket.connect();

        player2Socket.on('challengeRequest', ({challenge}) => {
            player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
            player1Socket.on('challengeStart', () => {
                player2Socket.emit('respondToChallenge', ({challengeId: challenge._id, accept: true}));
                player2Socket.on('badRequest', () => {
                    done();
                })
            });
        });
    });
});

describe('rating change', () => {
    it('should update ratings when ranked game ends', (done) => {

        const playerBlack = {
            username: chance.word({length: 10}),
            password: chance.word({length: 60}),
        };

        const playerWhite = {
            username: chance.word({length: 10}),
            password: chance.word({length: 60}),
        };

        

        User.create(playerBlack).then(playerBlack => {
            User.create(playerWhite).then(playerWhite => {
                Game.create({isRanked: true, vsCpu: false, playerBlack: playerBlack.username, playerWhite: playerWhite.username}).then(game => {
                    
                    player1Socket.disconnect();
                    ioServer.once('connect', (socket) => {
                        socket.handshake.session.username = playerBlack.username;
                        
                        player2Socket.disconnect();
                        ioServer.once('connect', (socket) => {
                            socket.handshake.session.username = playerWhite.username;
                            const id = game._id;
                            player1Socket.emit('joinGame', {id, color: 'b'});
                            player2Socket.emit('joinGame', {id, color: 'w'});
        
                            player2Socket.on('startGame', () => {
                                player2Socket.emit('resign', {id});
                                player1Socket.on('gameOver', () => {
                                    User.findById(playerBlack._id).then(playerBlack => {
                                        expect(playerBlack.rating).toBeGreaterThan(1000);
                                        User.findById(playerWhite._id).then(playerWhite => {
                                            expect(playerWhite.rating).toBeLessThan(1000);
                                            done();
                                        })
                                    });
                                })
                            });
                        });

                        player2Socket.connect();
                    });

                    player1Socket.connect();
                })
            })
        })
    })
})