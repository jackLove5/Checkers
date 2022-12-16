import {Piece } from "./Piece.js";

export class CheckersGame {
    static STARTING_PIECE_COUNT_PER_PLAYER = 12;
    static NUM_PLAYERS = 2;
    static PLAYER_WHITE = 'w';
    static PLAYER_BLACK = 'b';

    constructor() {
        this.players = new Array(CheckersGame.NUM_PLAYERS);
        let board = {};
        let stateStack = [];
        let moveStack = [];
        for (let i = 1; i <= 32; i++) {
            if (i < 13) {
                board["" + i] = new Piece("b");
            } else if (i < 21) {
                board["" + i] = null;
            } else {
                board["" + i] = new Piece("w");
            }
        }

        const getPlayableMovesByPos = (pos) => {
            pos = parseInt(pos);
            const possibleJumps = getPlayableJumpMoves();
            if (possibleJumps.length > 0) {
                return possibleJumps.filter(jumpMove => jumpMove.shortNotation.split("x")[0] == pos);
            }
            
            let possibleMoves = [];
            const movingPiece = board[pos];
            if (!movingPiece || movingPiece.color != this.turn) {
                return [];
            }

            if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
                const row = Math.floor((pos - 1) / 4);
                if (row % 2 === 0) {
                    if (pos + 4 <= 32 && board[pos + 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+4}`,
                            longNotation: `${pos}-${pos+4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos + 5 <= 32 && pos % 8 !== 4 && board[pos + 5] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+5}`,
                            longNotation: `${pos}-${pos+5}`,
                            capturedPieces: []
                        });
                    }
                
                } else {

                    if (pos + 4 <= 32 && board[pos + 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+4}`,
                            longNotation: `${pos}-${pos+4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos + 3 <= 32 && pos % 8 !== 5 && board[pos + 3] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+3}`,
                            longNotation: `${pos}-${pos+3}`,
                            capturedPieces: []
                        });
                    }
                }
            }

            if (movingPiece.color === CheckersGame.PLAYER_WHITE || movingPiece.isKing) {

                const row = Math.floor((pos - 1) / 4);
                if (row % 2 === 0) {

                    if (pos - 4 >= 1 && board[pos - 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-4}`,
                            longNotation: `${pos}-${pos-4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos - 3 >= 1 && pos % 8 !== 4 && board[pos - 3] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-3}`,
                            longNotation: `${pos}-${pos-3}`,
                            capturedPieces: []
                        });
                    }
                } else {
    
                    if (pos - 4 >= 1 && board[pos - 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-4}`,
                            longNotation: `${pos}-${pos-4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos - 5 >= 1 && pos % 8 !== 5 && board[pos - 5] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-5}`,
                            longNotation: `${pos}-${pos-5}`,
                            capturedPieces: []
                        });
                    }
                }
            }

            return possibleMoves;
        }

        

        const hasMoveByPos = (pos) => {
            return getPlayableMovesByPos(pos).length > 0;
        }

        const hasMoves = (player) => {
            for (let pos = 1; pos <= 32; pos++) {
                if (board[pos] && board[pos].color === player && hasMoveByPos(pos)) {
                    return true;
                }
            }

            return false;
        }

        const getPlayableJumpMoves = () => {
            let jumpMoves = [];
            for (let pos = 1; pos <= 32; pos++) {
                if (board[pos] && board[pos].color === this.turn) {
                    const jumps = getJumpMovesByPos(pos);
                    jumpMoves = jumpMoves.concat(jumps);
                }
            }

            return jumpMoves;
        };

        const getJumpMovesByPos = (pos) => {
            pos = parseInt(pos);
            if (pos < 1 || pos > 32) {
                return null;
            }
            let jumpMoves = [];

            if (board[pos] && board[pos].color === this.turn) {
                const row = Math.floor((pos - 1) / 4);
                if (board[pos].color === CheckersGame.PLAYER_BLACK || board[pos].isKing) {
                    if (row % 2 === 0) {
                        if (pos + 9 <= 32 && pos % 4 !== 0 && board[pos + 9] === null && board[pos + 5] && board[pos + 5].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos+9}`,
                                longNotation: `${pos}x${pos+9}`,
                                capturedPieces: [pos + 5]
                            });
                        }
    
                        if (pos + 7 <= 32 && pos % 4 !== 1 && board[pos + 7] === null && board[pos + 4] && board[pos + 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos+7}`,
                                longNotation: `${pos}x${pos+7}`,
                                capturedPieces: [pos + 4]
                            });
                        }
                    } else {
                        if (pos + 9 <= 32 && pos % 4 !== 0 && board[pos + 9] === null && board[pos + 4] && board[pos + 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos+9}`,
                                longNotation: `${pos}x${pos+9}`,
                                capturedPieces: [pos + 4]
                            });
                        }
    
                        if (pos + 7 <= 32 && pos % 4 !== 1 && board[pos + 7] === null && board[pos + 3] && board[pos + 3].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos+7}`,
                                longNotation: `${pos}x${pos+7}`,
                                capturedPieces: [pos + 3]
                            });
                        }
                    }
                }

                if (board[pos].color === CheckersGame.PLAYER_WHITE || board[pos].isKing) {
                    if (row % 2 === 1) {
                        if (pos - 9 >= 1 && pos % 4 !== 1 && board[pos - 9] === null && board[pos - 5] && board[pos - 5].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-9}`,
                                longNotation: `${pos}x${pos-9}`,
                                capturedPieces: [pos - 5]
                            });
                        }
    
                        if (pos - 7 >= 1 && pos % 4 !== 0 && board[pos - 7] === null && board[pos - 4] && board[pos - 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-7}`,
                                longNotation: `${pos}x${pos-7}`,
                                capturedPieces: [pos - 4]
                            });
                        }
                    } else {
                        if (pos - 9 >= 1 && pos % 4 !== 1 && board[pos - 9] === null && board[pos - 4] && board[pos - 4].color !== this.turn) {
                            jumpMoves.push({
                                shortNotation: `${pos}x${pos-9}`,
                                longNotation: `${pos}x${pos-9}`,
                                capturedPieces: [pos - 4]
                            });
                        }
    
                        if (pos - 7 >= 1 && pos % 4 !== 0 && board[pos - 7] === null && board[pos - 3] && board[pos - 3].color !== this.turn) {
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
                
                const capturedPiece = board[jumpMove.capturedPieces[0]];
                const [origin, dst] = jumpMove.shortNotation.split('x');
                const jumpingPiece = board[origin];
                
                board[jumpMove.capturedPieces[0]] = null;
                board[dst] = jumpingPiece;
                board[origin] = null;
                let subJumps = getJumpMovesByPos(dst);

                board[dst] = null;
                board[origin] = jumpingPiece;
                board[jumpMove.capturedPieces[0]] = capturedPiece;

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


        this.getPlayableMovesByPosition = (pos) => getPlayableMovesByPos(pos);

        this.getPieceAtPosition = (position) => board[position];

        this.doMove = (origin, dst, longNotation) => {
            if (!origin || !dst) {
                throw "Invalid move. Must specify origin square and destination square";
            }
/*
            if (this.getPieceAtPosition(dst) !== null) {
                throw `Invalid move ${origin}-${dst}. Destination square is not empty. stateStack: ${stateStack} moveStack ${moveStack}`;
            }*/

            if (this.getPieceAtPosition(origin) === null) {
                throw "Invalid move. Origin square is empty";
            }

            if (board[origin].color !== this.turn) {
                throw "Invalid move. It is the other player's turn";
            }

            origin = parseInt(origin);
            dst = parseInt(dst);

            const candMove = [origin, dst];
            let validMoves = getPlayableMovesByPos(origin);
            const foundMoves = validMoves.filter(move => {
                const [moveOrigin, moveDst] = move.shortNotation.split(/x|-/);
                if (longNotation) {
                    return longNotation == move.longNotation && moveOrigin == origin && moveDst == dst;
                } else {
                    return moveOrigin == origin && moveDst == dst;
                }
            });

            if (foundMoves.length == 0) {
                throw `Invalid move. ${candMove} does not exist within ${JSON.stringify(validMoves)}`;
            }

            if (foundMoves.length > 1) {
                throw `Ambiguous move ${candMove}. Must provide long notation`;
            }

            const foundMove = foundMoves[0];
            stateStack.push(JSON.stringify(board));
            moveStack.push(JSON.stringify(foundMove));
            let capturedPieces = foundMove.capturedPieces;

            if (dst !== origin) {
                board[dst] = board[origin];
                board[origin] = null;
            }

            capturedPieces.forEach(p => board[p] = null);

            if (this.turn === CheckersGame.PLAYER_BLACK) {
                if (dst >= 29 && dst <= 32 && !board[dst].isKing) {
                    board[dst].isKing = true;
                }
            } else {
                if (dst >= 1 && dst <= 4 && !board[dst].isKing) {
                    board[dst].isKing = true;
                }
            }

            this.turn = this.turn === CheckersGame.PLAYER_BLACK ? CheckersGame.PLAYER_WHITE : CheckersGame.PLAYER_BLACK;

        };

        this.undoLastMove = () => {

            if (stateStack.length == 0) {
                throw 'No move to undo';
            }

            const newState = stateStack[stateStack.length - 1];
            stateStack.pop();
            moveStack.pop();
            board = JSON.parse(newState);

            this.turn = this.turn === CheckersGame.PLAYER_BLACK ? CheckersGame.PLAYER_WHITE : CheckersGame.PLAYER_BLACK;
        }

        this.getWinner = () => {
            if (this.turn === CheckersGame.PLAYER_BLACK && !hasMoves(CheckersGame.PLAYER_BLACK)) {
                return CheckersGame.PLAYER_WHITE;
            }

            if (this.turn === CheckersGame.PLAYER_WHITE && !hasMoves(CheckersGame.PLAYER_WHITE)) {
                return CheckersGame.PLAYER_BLACK;
            }

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