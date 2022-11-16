const {CheckersBoard} = require("./CheckersBoard");

class CheckersGame {
    static STARTING_PIECE_COUNT_PER_PLAYER = 12;
    static NUM_PLAYERS = 2;
    static PLAYER_WHITE = 'w';
    static PLAYER_BLACK = 'b';

    constructor() {
        this.players = new Array(CheckersGame.NUM_PLAYERS);
        let board = new CheckersBoard();


        const hasMoveByPos = (pos) => {
            const movingPiece = board.squares[pos];
            if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
                const row = Math.floor((pos - 1) / 4);

                // jumps
                if (row % 2 === 0) {
                    if (pos + 9 <= 32 && pos % 4 !== 0 && board.squares[pos + 9] === null && board.squares[pos + 5] && board.squares[pos + 5].color !== this.turn) {
                        return true;
                    }

                    if (pos + 7 <= 32 && pos % 4 !== 1 && board.squares[pos + 7] === null && board.squares[pos + 4] && board.squares[pos + 4].color !== this.turn) {
                        return true;
                    }
                } else {
                    if (pos + 9 <= 32 && pos % 4 !== 0 && board.squares[pos + 9] === null && board.squares[pos + 4] && board.squares[pos + 4].color !== this.turn) {
                        return true;
                    }

                    if (pos + 7 <= 32 && pos % 4 !== 1 && board.squares[pos + 7] === null && board.squares[pos + 3] && board.squares[pos + 3].color !== this.turn) {
                       return true;
                    }
                }


                // non-jumps
                if (row % 2 === 0) {
                    if (pos % 8 === 4 && board.squares[pos + 4] == null) {
                        return true;
                    }

                    if (pos % 8 !== 4 && board.squares[pos + 4] == null || board.squares[pos + 5] == null) {
                        return true;
                    }

                } else {
                    if (origin % 8 === 5 && board.squares[pos + 4] == null) {
                        return true;
                    }
                    
                    if (origin % 8 !== 5 && board.squares[pos + 3] == null || board.squares[pos + 4] == null) {
                        return true;
                    }
                }
            }

            if (movingPiece.color === CheckersGame.PLAYER_WHITE || movingPiece.isKing) {
                if (row % 2 === 1) {
                    if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 5] && board.squares[pos - 5].color !== this.turn) {
                        return true;
                    }

                    if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                        return true;
                    }
                } else {
                    if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                        return true;
                    }

                    if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 3] && board.squares[pos - 3].color !== this.turn) {
                        return true;
                    }
                }

                if (row % 2 === 0) {
                    if (origin % 8 === 4 && board.squares[pos - 4] == null) {
                        return true;
                    } 
                    
                    if (origin % 8 !== 4 && (board.squares[pos - 4] == null || board.squares[pos - 3] == null)) {
                        return true;
                    }
                } else {
    
                    if (origin % 8 === 5 && board.squares[pos - 4] == null) {
                        return true;
                    }

                    if (origin % 8 !== 5 && (board.squares[pos - 4] == null || board.squares[pos - 5] == null)) {
                        return true;
                    }
                }
            }

            return false;
        }
        const hasMoves = (player) => {
            for (let pos = 1; pos <= 32; pos++) {
                if (board.squares[pos] && board.squares[pos].color === player && hasMoveByPos(pos)) {
                    return true;
                }
            }

            return false;
        }
        this.getWinner = () => {
            if (this.turn === CheckersGame.PLAYER_BLACK && !hasMoves(CheckersGame.PLAYER_BLACK)) {
                return CheckersGame.PLAYER_WHITE;
            }

            if (this.turn === CheckersGame.PLAYER_WHITE && !hasMoves(CheckersGame.PLAYER_WHITE)) {
                return CheckersGame.PLAYER_BLACK;
            }

        }
        const getPossibleJumpsBlack = () => {
            let jumpMoves = [];
            for (let pos = 1; pos <= 32; pos++) {
               const jumps = getJumpMovesByPosBlack(pos);
               jumpMoves = jumpMoves.concat(jumps);
            }

            return jumpMoves;
        };

        const getJumpMovesByPosBlack = (pos) => {
            pos = parseInt(pos);
            if (pos < 1 || pos > 32) {
                return null;
            }
            let jumpMoves = [];

            if (board.squares[pos] && board.squares[pos].color === this.turn) {
                const row = Math.floor((pos - 1) / 4);
                if (row % 2 === 0) {
                    if (pos + 9 <= 32 && pos % 4 !== 0 && board.squares[pos + 9] === null && board.squares[pos + 5] && board.squares[pos + 5].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos+9}`,
                            longNotation: `${pos}x${pos+9}`,
                            capturedPieces: [pos + 5]
                        });
                    }

                    if (pos + 7 <= 32 && pos % 4 !== 1 && board.squares[pos + 7] === null && board.squares[pos + 4] && board.squares[pos + 4].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos+7}`,
                            longNotation: `${pos}x${pos+7}`,
                            capturedPieces: [pos + 4]
                        });
                    }
                } else {
                    if (pos + 9 <= 32 && pos % 4 !== 0 && board.squares[pos + 9] === null && board.squares[pos + 4] && board.squares[pos + 4].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos+9}`,
                            longNotation: `${pos}x${pos+9}`,
                            capturedPieces: [pos + 4]
                        });
                    }

                    if (pos + 7 <= 32 && pos % 4 !== 1 && board.squares[pos + 7] === null && board.squares[pos + 3] && board.squares[pos + 3].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos+7}`,
                            longNotation: `${pos}x${pos+7}`,
                            capturedPieces: [pos + 3]
                        });
                    }
                }

                if (board.squares[pos].isKing) {
                    if (row % 2 === 1) {
                        if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 5] && board.squares[pos - 5].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-9}`,
                                longNotation: `${pos}x${pos-9}`,
                                capturedPieces: [pos - 5]
                            });
                        }
    
                        if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-7}`,
                                longNotation: `${pos}x${pos-7}`,
                                capturedPieces: [pos - 4]
                            });
                        }
                    } else {
                        if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-9}`,
                                longNotation: `${pos}x${pos-9}`,
                                capturedPieces: [pos - 4]
                            });
                        }
    
                        if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 3] && board.squares[pos - 3].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-7}`,
                                longNotation: `${pos}x${pos-7}`,
                                capturedPieces: [pos - 3]
                            });
                        }
                    }
                }
            }


            let results = [];
            jumpMoves.forEach(jumpMove => {
                
                const capturedPiece = board.squares[jumpMove.capturedPieces[0]];
                const [origin, dst] = jumpMove.shortNotation.split('x');
                const jumpingPiece = board.squares[origin];
                board.squares[jumpMove.capturedPieces[0]] = null;
                board.squares[dst] = jumpingPiece;
                board.squares[origin] = null;
                let subJumps = getJumpMovesByPosBlack(dst);

                board.squares[dst] = null;
                board.squares[origin] = jumpingPiece;
                board.squares[jumpMove.capturedPieces[0]] = capturedPiece;

                if (subJumps.length > 0) {
                    subJumps.forEach(subJump => {
                        results.push({
                            shortNotation: `${origin}x${subJump.shortNotation.split('x').slice(-1)[0]}`,
                            longNotation: `${origin}x${subJump.longNotation}`,
                            capturedPieces: jumpMove.capturedPieces.concat(subJump.capturedPieces)
                        });
                    });
                } else {
                    results.push(jumpMove);
                }
            });

            return results;
        };

        const getJumpMovesByPosWhite = (pos) => {
            pos = parseInt(pos);
            if (pos < 1 || pos > 32) {
                return null;
            }
            let jumpMoves = [];

            if (board.squares[pos] && board.squares[pos].color === this.turn) {
                const row = Math.floor((pos - 1) / 4);
                if (row % 2 === 1) {
                    if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 5] && board.squares[pos - 5].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos-9}`,
                            longNotation: `${pos}x${pos-9}`,
                            capturedPieces: [pos - 5]
                        });
                    }

                    if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos-7}`,
                            longNotation: `${pos}x${pos-7}`,
                            capturedPieces: [pos - 4]
                        });
                    }
                } else {
                    if (pos - 9 >= 1 && pos % 4 !== 1 && board.squares[pos - 9] === null && board.squares[pos - 4] && board.squares[pos - 4].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos-9}`,
                            longNotation: `${pos}x${pos-9}`,
                            capturedPieces: [pos - 4]
                        });
                    }

                    if (pos - 7 >= 1 && pos % 4 !== 0 && board.squares[pos - 7] === null && board.squares[pos - 3] && board.squares[pos - 3].color !== this.turn) {
                        jumpMoves.push({
                            shortNotation: `${pos}x${pos-7}`,
                            longNotation: `${pos}x${pos-7}`,
                            capturedPieces: [pos - 3]
                        });
                    }
                }
            }

            let results = [];
            jumpMoves.forEach(jumpMove => {
                const capturedPiece = board.squares[jumpMove.capturedPieces[0]];
                const [origin, dst] = jumpMove.shortNotation.split('x');
                const jumpingPiece = board.squares[origin];
                board.squares[jumpMove.capturedPieces[0]] = null;
                board.squares[dst] = jumpingPiece;
                board.squares[origin] = null;
                let subJumps = getJumpMovesByPosWhite(dst);
                if (jumpingPiece.isKing) {
                    subJumps = subJumps.concat(getJumpMovesByPosBlack(dst));
                }
                board.squares[dst] = null;
                board.squares[origin] = jumpingPiece;
                board.squares[jumpMove.capturedPieces[0]] = capturedPiece;

                if (subJumps.length > 0) {
                    subJumps.forEach(subJump => {
                        results.push({
                            shortNotation: `${origin}x${subJump.shortNotation.split('x').slice(-1)[0]}`,
                            longNotation: `${origin}x${subJump.longNotation}`,
                            capturedPieces: jumpMove.capturedPieces.concat(subJump.capturedPieces)
                        });
                    });
                } else {
                    results.push(jumpMove);
                }
            });

            return results;
        };


        const getPossibleJumpsWhite = () => {
            let jumpMoves = [];
            for (let pos = 1; pos <= 32; pos++) {
               const jumps = getJumpMovesByPosWhite(pos);
               if (board.squares[pos] && board.squares[pos].color === CheckersGame.PLAYER_WHITE && board.squares[pos].isKing) {
                   const jumps = getJumpMovesByPosBlack(pos);
                   jumpMoves = jumpMoves.concat(jumps);
               }

               jumpMoves = jumpMoves.concat(jumps);
            }

            return jumpMoves;
        }
        this.getPieceAtPosition = (position) => board.squares[position];
        this.makeBlackMove = (origin, dst) => {

            if (origin === undefined || dst === undefined) {
                throw "No move provided";
            }
            if (this.turn !== CheckersGame.PLAYER_BLACK) {
                throw "Not black's turn";
            }
            if (this.getPieceAtPosition(dst) !== null) {
                throw "Invalid move";
            }

            if (board.squares[origin].color !== 'b') {
                throw "Invalid move";
            }

    
            origin = parseInt(origin);
            dst = parseInt(dst);
            
            const jumpMoves = getPossibleJumpsBlack();
            let capturedPieces = [];
            if (jumpMoves.length > 0) {

                const move = [origin, dst];
                const jumpMove = jumpMoves.find(jump => {
                    const [jumpOrigin, jumpDst] = jump.shortNotation.split('x');
                    return origin == jumpOrigin && dst == jumpDst;
                });

                if (!jumpMove) {
                    throw `Invalid jump move. ${move} does not exist within ${JSON.stringify(jumpMoves)}`;
                }

                capturedPieces = jumpMove.capturedPieces;

            } else {
                
                if (!board.squares[origin].isKing) {
                    if (!isValidBackwardMove(origin, dst)) {
                        throw `Invalid move ${origin},${dst}`;
                    }
                } else {
                    if (!isValidForwardMove(origin, dst) && !isValidBackwardMove(origin, dst)) {
                        throw `Invalid move ${str}`;
                    }
                }

    

            }

            board.squares[dst] = board.squares[origin];
            board.squares[origin] = null;
            if (dst >= 29 && dst <= 32 && !board.squares[dst].isKing) {
                board.squares[dst].isKing = true;
            }
            capturedPieces.forEach(p => board.squares[p] = null);
            this.turn = CheckersGame.PLAYER_WHITE;
    
        };

        let isValidBackwardMove = (origin, dst) => {
            const row = Math.floor((origin - 1) / 4);

            if (row % 2 === 0) {
                if (origin % 8 === 4) {
                    return dst === origin + 4;
                } else {
                    return dst === origin + 4 || dst === origin + 5;
                }
            } else {
                if (origin % 8 === 5) {
                    return dst === origin + 4;
                } else {
                    return dst === origin + 3 || dst === origin + 4;
                }
            }
        }
        let isValidForwardMove = (origin, dst) => {
            const row = Math.floor((origin - 1) / 4);

            if (row % 2 === 0) {
                if (origin % 8 === 4) {
                    return dst === origin - 4;
                } else {
                    return dst === origin - 4 || dst === origin - 3;
                }
            } else {

                if (origin % 8 === 5) {
                    return dst === origin - 4;
                } else {
                    return dst === origin - 4 || dst === origin - 5;
                }
            }
        }

        this.makeWhiteMove = (origin, dst) => {
            if (this.turn !== CheckersGame.PLAYER_WHITE) {
                throw "White can't move at the beginning of the game";
            }

            if (this.getPieceAtPosition(dst) !== null) {
                throw "Invalid move";
            }
    
            if (origin === undefined || dst === undefined) {
                throw "Invalid move";
            }

            if (board.squares[origin].color !== CheckersGame.PLAYER_WHITE) {
                throw `Invalid move ${str}`;
            }
    
            origin = parseInt(origin);
            dst = parseInt(dst);

            const jumpMoves = getPossibleJumpsWhite();
            let capturedPieces = [];
            if (jumpMoves.length > 0) {

                const move = [origin, dst];
                const jumpMove = jumpMoves.find(jump => {
                    const [jumpOrigin, jumpDst] = jump.shortNotation.split('x');
                    return origin == jumpOrigin && dst == jumpDst;
                });

                if (!jumpMove) {
                    throw `Invalid jump move. ${move} does not exist within ${JSON.stringify(jumpMoves)}`;
                }

                capturedPieces = jumpMove.capturedPieces;

            } else {
                let str = `${origin}-${dst}`;
                if (!board.squares[origin].isKing) {
                    if (!isValidForwardMove(origin, dst)) {
                        throw `Invalid move ${str}`;
                    }
                } else {

                    if (!isValidForwardMove(origin, dst) && !isValidBackwardMove(origin, dst)) {
                        throw `Invalid move ${str}`;
                    }
                }              
            }

            board.squares[dst] = board.squares[origin];
            board.squares[origin] = null;
            if (dst >= 1 && dst <= 4 && !board.squares[dst].isKing) {
                board.squares[dst].isKing = true;
            }
            capturedPieces.forEach(p => board.squares[p] = null);
            this.turn = CheckersGame.PLAYER_BLACK;
        }
    
    }

    start() {
        this.whitePieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
        this.blackPieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
        this.whitePiecesInStartingPosition = true;
        this.blackPiecesInStartingPosition = true;
        this.turn = CheckersGame.PLAYER_BLACK;
    }




}

module.exports = {
    CheckersGame: CheckersGame
};