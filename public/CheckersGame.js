const Piece = require('./Piece');

class CheckersGame {
    static PLAYER_WHITE = 'w';
    static PLAYER_BLACK = 'b';

    constructor() {
        this.turn = CheckersGame.PLAYER_BLACK;
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

        const notationToCoords = (num) => {
            num = parseInt(num);
            if (typeof num !== 'number' || Number.isNaN(num) || num > 32 || num < 1) {
                return undefined;
            }

            const row = Math.floor((num - 1) / 4);
            const col = row % 2 === 0 ? 1 + ((num - 1) % 4) * 2 : ((num - 1) % 4) * 2;
            return [row, col];
        }

        const coordsToNotation = (row, col) => {
            if (row < 0 || row >= 8 || col < 0 || col >= 8 || row % 2 === col % 2) {
                return undefined;
            }

            return row * 4 + Math.floor(col / 2) + 1;
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
                return possibleJumps.filter(jumpMove => jumpMove.origin == pos);
            }
            
            let possibleMoves = [];
            const movingPiece = board[pos];

            if (!movingPiece || movingPiece.color != this.turn) {
                return [];
            }

            let yDirections = [];
            let xDirections = [-1, 1];
            if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
                yDirections.push(1);
            }

            if (movingPiece.color === CheckersGame.PLAYER_WHITE || movingPiece.isKing) {
                yDirections.push(-1);
            }

            if (notationToCoords(pos) === undefined) {
                throw `Invalid piece position ${pos}`;
            }

            const [row, col] = notationToCoords(pos);
            for (let dy of yDirections) {
                for (let dx of xDirections) {
                    const dst = coordsToNotation(row + dy, col + dx);
                    if (dst && !board[dst]) {
                        possibleMoves.push({
                            origin: pos,
                            dst: dst,
                            shortNotation: `${pos}-${dst}`,
                            longNotation: `${pos}-${dst}`,
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

        const getSingleJumpsByPos = (pos) => {
            const [row, col] = notationToCoords(pos);

            let jumpMoves = [];

            if (board[pos] && board[pos].color === this.turn) {
                let xDirections = [1,-1];
                let yDirections = [];
                if (board[pos].color === CheckersGame.PLAYER_BLACK || board[pos].isKing) {
                    yDirections.push(1);
                }

                if (board[pos].color === CheckersGame.PLAYER_WHITE || board[pos].isKing) {
                    yDirections.push(-1);
                }

                for (let dy of yDirections) {
                    for (let dx of xDirections) {
                        const dst = coordsToNotation(row + dy * 2, col + dx * 2);
                        const capturedPiece = coordsToNotation(row + dy, col + dx);
                        if (dst && capturedPiece && !board[dst] && board[capturedPiece] && board[capturedPiece].color !== board[pos].color) {
                            jumpMoves.push({
                                origin: pos,
                                dst: dst,
                                shortNotation: `${pos}x${dst}`,
                                longNotation: `${pos}x${dst}`,
                                capturedPieces: [coordsToNotation(row + dy, col + dx)]
                            })
                        }
                    }
                }
            }

            return jumpMoves;
        }
        const getJumpMovesByPos = (pos) => {
            if (!notationToCoords(pos)) {
                return [];
            }

            const singleJumps = getSingleJumpsByPos(pos);

            let jumpMoves = [];
            singleJumps.forEach(jumpMove => {

                const {origin, dst, capturedPieces} = jumpMove;

                const jumpingPiece = board[origin];
                const capturedPiece = board[capturedPieces[0]];
                
                board[capturedPieces[0]] = null;
                board[dst] = jumpingPiece;
                board[origin] = null;

                let subJumps = getJumpMovesByPos(dst);

                board[dst] = null;
                board[origin] = jumpingPiece;
                board[capturedPieces[0]] = capturedPiece;

                if (subJumps.length > 0) {
                    subJumps.forEach(subJump => {
                        jumpMoves.push({
                            origin: origin,
                            dst: subJump.dst,
                            shortNotation: `${origin}x${subJump.dst}`,
                            longNotation: `${origin}x${subJump.longNotation}`,
                            capturedPieces: capturedPieces.concat(subJump.capturedPieces)
                        });
                    });
                } else {
                    jumpMoves.push(jumpMove);
                }
            });

            return jumpMoves;
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
            
            let lastAdvance = stateStack.length === 0 ? undefined : stateStack[stateStack.length - 1].lastAdvance;
            let lastCapture = stateStack.length === 0 ? undefined : stateStack[stateStack.length - 1].lastCapture;
            
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
                const {lastAdvance, lastCapture} = stateStack[stateStack.length - 1];
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
            p1Pieces = p1Pieces.split(',');
            p1Pieces = p1Pieces.map(p => p.toLowerCase()).map((p, i, arr) => i == 0 ? p : arr[0].charAt(0) + p);
            p2Pieces = p2Pieces.split(',');
            p2Pieces = p2Pieces.map(p => p.toLowerCase()).map((p, i, arr) => i == 0 ? p : arr[0].charAt(0) + p);

            p1Pieces.concat(p2Pieces).forEach(piece => {
                const color = piece.charAt(0) == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;
                piece = piece.substring(1);
                if (!piece) {
                    return;
                }

                const isKing = piece.charAt(0) == 'k';
                if (isKing) {
                    piece = piece.substring(1);
                }

                const pos = parseInt(piece);
                if (Number.isNaN(pos)) {
                    throw `Invalid FEN format. ${fen}`;
                }

                board[pos] = new Piece(color);
                board[pos].isKing = isKing;
            });

            this.turn = turn.toLowerCase() == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;

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
    }
}

module.exports = CheckersGame;