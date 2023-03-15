/*
    Using boilerplate written by Tomasz Zwierzchoń
    https://medium.com/@tozwierz/testing-socket-io-with-jest-on-backend-node-js-f71f7ec7010f
*/

const app = require('../app')
const io = require('socket.io-client')
const setupSocketServer = require('../socket/setup')

const Game = require('../models/game')
const connectDB = require('../db/connect')
require('dotenv').config();

let player1Socket;
let player2Socket;
let player3Socket;
let httpServer;
let httpServerAddr;
let ioServer;
let db;

beforeAll((done) => {
    let {io, server} = setupSocketServer(app);

    ioServer = io;
    httpServer = server;
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

        player1Socket.on('connect', () => {
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

        player2Socket.on('connect', () => {
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

        player3Socket.on('connect', () => {
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
        //await player1Socket.request.session.destroy();
        player1Socket.disconnect();
    }

    if (player2Socket.connected) {
        //await player2Socket.request.session.destroy();
        player2Socket.disconnect();
    }

    if (player3Socket.connected) {
        //await player3Socket.request.session.destroy();
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
            player2Socket.emit('joinGame', {id, color});

            player1Socket.on('startGame', ({color}) => {
                expect(color).toBe('b');
                if (player2Assigned) {
                    done();
                }

                player1Assigned = true;
            });

            player2Socket.on('startGame', ({color}) => {
                expect(color).toBe('w');
                if (player1Assigned) {
                    done();
                }

                player2Assigned = true;
            })


        })
    })
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
                player1Socket.emit('makeMove', {move, id});
                player1Socket.on('move', () => {
                    done();
                })
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

    test("(Vs CPU) server should emit gameover when no more moves can be played", (done) => {
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
    })

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
    })
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

    test("server should emit gameOver event when both players emit offerDraw event", (done) => {
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
    })
})