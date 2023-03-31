const Piece = require('./Piece');

//import {Piece } from "./Piece.js";

class CheckersGame {
    static STARTING_PIECE_COUNT_PER_PLAYER = 12;
    static NUM_PLAYERS = 2;
    static PLAYER_WHITE = 'w';
    static PLAYER_BLACK = 'b';


    constructor() {
        this.players = new Array(CheckersGame.NUM_PLAYERS);
        let board = {};
        let stateStack = [];
        for (let i = 1; i <= 32; i++) {
            if (i < 13) {
                board["" + i] = new Piece("b");
            } else if (i < 21) {
                board["" + i] = null;
            } else {
                board["" + i] = new Piece("w");
            }
        }

        const getFen = () => {
            const whitePieces = [];
            const blackPieces = [];
            for (let i = 1; i <= 32; i++) {
                if (board[i]) {
                    const king = board[i].isKing ? 'K' : '';
                    if (board[i].color === CheckersGame.PLAYER_WHITE) {
                        whitePieces.push(king + i);
                    } else if (board[i]) {
                        blackPieces.push(king + i);
                    }
                }
            }

            const turn = this.turn === CheckersGame.PLAYER_WHITE ? 'W' : 'B';
            return `${turn}:W${whitePieces.join(',')}:B${blackPieces.join(',')}`;
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
        this.getPlayableMoves = () => {
            let res = [];
            for (let i = 1; i <= 32; i++) {
                res = res.concat(getPlayableMovesByPos(i));
            }

            return res;
        }

        this.getPieceAtPosition = (position) => board[position];

        this.doMove = (origin, dst, longNotation) => {
            if (!origin || !dst) {
                throw "Invalid move. Must specify origin square and destination square";
            }

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
            
            let lastAdvance = stateStack.length === 0 ? undefined : stateStack.at(-1).lastAdvance;
            let lastCapture = stateStack.length === 0 ? undefined : stateStack.at(-1).lastCapture;
            
            if (foundMove.capturedPieces.length > 0) {
                lastCapture = stateStack.length;
            } else if (!board[origin].isKing) {
                lastAdvance = stateStack.length;
            }
            
            stateStack.push({
                move: foundMove,
                fen: getFen(),
                lastCapture,
                lastAdvance
            });

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

        this.isDraw = () => {
            const hasThreefold = stateStack.filter(s => s.fen === getFen()).length === 2;
            if (hasThreefold) {
                return true;
            }
            if (stateStack.length > 0) {
                const {lastAdvance, lastCapture} = stateStack.at(-1);
                const movesSinceLastAdvance = Math.floor((stateStack.length - 1 - lastAdvance) / 2);
                const movesSinceLastCapture = Math.floor((stateStack.length - 1 - lastCapture) / 2);
                if (movesSinceLastAdvance >= 40 && movesSinceLastCapture >= 40) {
                    return true;
                }
            }

            return false;

        }

        this.constructFromFen = (fen) => {
            for (let i = 1; i <= 32; i++) {
                board[i] = null;
            }

            let [turn, p1Pieces, p2Pieces] = fen.split(':');
            turn = turn.toLowerCase();
            p1Pieces = p1Pieces.split(',');
            p1Pieces = p1Pieces.map(p => p.toLowerCase()).map((p, i, arr) => i == 0 ? p : arr[0].charAt(0) + p);
            p2Pieces = p2Pieces.split(',');
            p2Pieces = p2Pieces.map(p => p.toLowerCase()).map((p, i, arr) => i == 0 ? p : arr[0].charAt(0) + p);

            p1Pieces.concat(p2Pieces).forEach(piece => {
                const color = piece.charAt(0) == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;
                piece = piece.substring(1);

                const isKing = piece.charAt(0) == 'k';
                if (isKing) {
                    piece = piece.substring(1);
                }


                const pos = parseInt(piece);
                if (pos === NaN) {
                    throw 'Invalid FEN format';
                }

                board[pos] = new Piece(color);
                board[pos].isKing = isKing;
            });

            this.turn = turn == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;

        }

        this.undoLastMove = () => {

            if (stateStack.length == 0) {
                throw 'No move to undo';
            }

            const newState = stateStack.pop();
            this.constructFromFen(newState.fen);
        }

        this.getWinner = () => {
            if (this.turn === CheckersGame.PLAYER_BLACK && !hasMoves(CheckersGame.PLAYER_BLACK)) {
                return CheckersGame.PLAYER_WHITE;
            }

            if (this.turn === CheckersGame.PLAYER_WHITE && !hasMoves(CheckersGame.PLAYER_WHITE)) {
                return CheckersGame.PLAYER_BLACK;
            }

        }

        this.getFen = getFen;
        this.start = () => {
            this.whitePieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
            this.blackPieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
            this.whitePiecesInStartingPosition = true;
            this.blackPiecesInStartingPosition = true;
            this.turn = CheckersGame.PLAYER_BLACK;
        }
    }


}

module.exports = CheckersGame;