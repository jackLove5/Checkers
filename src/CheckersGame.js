const {CheckersBoard} = require("./CheckersBoard");

class CheckersGame {
    static STARTING_PIECE_COUNT_PER_PLAYER = 12;
    static NUM_PLAYERS = 2;
    static PLAYER_WHITE = 'w';
    static PLAYER_BLACK = 'b';

    constructor() {
        this.players = new Array(CheckersGame.NUM_PLAYERS);
        let board = new CheckersBoard();

        const getMovesByPos = (pos) => {
            const movingPiece = board.squares[pos];
            let possibleMoves = [];
            possibleMoves = possibleMoves.concat(getJumpMovesByPos(pos));
            if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
                const row = Math.floor((pos - 1) / 4);
                if (row % 2 === 0) {
                    if (pos + 4 <= 32 && board.squares[pos + 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+4}`,
                            longNotation: `${pos}-${pos+4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos + 5 <= 32 && pos % 8 !== 4 && board.squares[pos + 5] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+5}`,
                            longNotation: `${pos}-${pos+5}`,
                            capturedPieces: []
                        });
                    }
                
                } else {

                    if (pos + 4 <= 32 && board.squares[pos + 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos+4}`,
                            longNotation: `${pos}-${pos+4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos + 3 <= 32 && pos % 8 !== 5 && board.squares[pos + 3] === null) {
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

                    if (pos - 4 >= 1 && board.squares[pos - 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-4}`,
                            longNotation: `${pos}-${pos-4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos - 3 >= 1 && pos % 8 !== 4 && board.squares[pos - 3] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-3}`,
                            longNotation: `${pos}-${pos-3}`,
                            capturedPieces: []
                        });
                    }
                } else {
    
                    if (pos - 4 >= 1 && board.squares[pos - 4] === null) {
                        possibleMoves = possibleMoves.concat({
                            shortNotation: `${pos}-${pos-4}`,
                            longNotation: `${pos}-${pos-4}`,
                            capturedPieces: []
                        });
                    }

                    if (pos - 5 >= 1 && pos % 8 !== 5 && board.squares[pos - 5] === null) {
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
            return getMovesByPos(pos).length > 0;
        }

        const hasMoves = (player) => {
            for (let pos = 1; pos <= 32; pos++) {
                if (board.squares[pos] && board.squares[pos].color === player && hasMoveByPos(pos)) {
                    return true;
                }
            }

            return false;
        }

        const getPossibleJumps = () => {
            let jumpMoves = [];
            for (let pos = 1; pos <= 32; pos++) {
                if (board.squares[pos] && board.squares[pos].color === this.turn) {
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

            if (board.squares[pos] && board.squares[pos].color === this.turn) {
                const row = Math.floor((pos - 1) / 4);
                if (board.squares[pos].color === CheckersGame.PLAYER_BLACK || board.squares[pos].isKing) {
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
                }

                if (board.squares[pos].color === CheckersGame.PLAYER_WHITE || board.squares[pos].isKing) {
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
                let subJumps = getJumpMovesByPos(dst);

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


        this.getMovesByPosition = (pos) => getMovesByPos(pos);

        this.getPieceAtPosition = (position) => board.squares[position];

        this.doMove = (origin, dst) => {
            if (!origin || !dst) {
                throw "Invalid move. Must specify origin square and destination square";
            }

            if (this.getPieceAtPosition(dst) !== null) {
                throw "Invalid move. Destination square is not empty";
            }

            if (this.getPieceAtPosition(origin) === null) {
                throw "Invalid move. Origin square is empty";
            }

            if (board.squares[origin].color !== this.turn) {
                throw "Invalid move. It is the other player's turn";
            }

            origin = parseInt(origin);
            dst = parseInt(dst);

            const candMove = [origin, dst];
            let validMoves = getMovesByPos(origin);
            const foundMove = validMoves.find(move => {
                const [moveOrigin, moveDst] = move.shortNotation.split(/x|-/);
                return moveOrigin == origin && moveDst == dst;
            });

            if (!foundMove) {
                throw `Invalid move. ${candMove} does not exist within ${JSON.stringify(validMoves)}`;
            }

            const possibleJumpMoves = getPossibleJumps();
            if (possibleJumpMoves.length > 0 && foundMove.capturedPieces.length === 0) {
                throw `Invalid move. Must jump if possible`;
            }

            let capturedPieces = foundMove.capturedPieces;

            board.squares[dst] = board.squares[origin];
            board.squares[origin] = null;
            capturedPieces.forEach(p => board.squares[p] = null);

            if (this.turn === CheckersGame.PLAYER_BLACK) {
                if (dst >= 29 && dst <= 32 && !board.squares[dst].isKing) {
                    board.squares[dst].isKing = true;
                }
            } else {
                if (dst >= 1 && dst <= 4 && !board.squares[dst].isKing) {
                    board.squares[dst].isKing = true;
                }
            }

            this.turn = this.turn === CheckersGame.PLAYER_BLACK ? CheckersGame.PLAYER_WHITE : CheckersGame.PLAYER_BLACK;
        };

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

module.exports = {
    CheckersGame: CheckersGame
};