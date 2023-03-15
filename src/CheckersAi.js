import { CheckersGame} from "./CheckersGame.js";

export class CheckersAi {
    constructor(game) {
        this.game = game;
        this.maxDepth = 5;

        this.maxValue = (state, a, b, depth) => {
            if (state.getWinner() || state.isDraw() || depth == this.maxDepth) {
                return [null, this.getBoardEvaluation(state)];
            }

            let v = -Infinity;
            let moveToReturn = null;
            for (let i = 1; i <= 32; i++) {
                const moves = state.getPlayableMovesByPosition(i);
                for (let j = 0; j < moves.length; j++) {
                    const move = moves[j];
                    // make move
                    const [origin, dst] = move.shortNotation.split(/x|-/);
                    const longNotation = move.longNotation;
                    state.doMove(origin, dst, longNotation);
                    
                    const [_, evaluation] =  this.minValue(state, a, b, depth + 1)
                    v = Math.max(v, evaluation);
                    
                    // unmake move
                    state.undoLastMove();

                    if (v >= b) {
                        return [move, v];
                    }

                    if (v >= a) {
                        a = v;
                        moveToReturn = move;
                    }

                }
            }

            return [moveToReturn, v];
        }

        this.minValue = (state, a, b, depth) => {

            if (state.getWinner() || state.isDraw() || depth == this.maxDepth) {
                return [null, this.getBoardEvaluation(state)];
            }

            let v = Infinity;
            let moveToReturn = null;
            for (let i = 1; i <= 32; i++) {
                const moves = state.getPlayableMovesByPosition(i);
                for (let j = 0; j < moves.length; j++) {
                    const move = moves[j];
                    // make move
                    const [origin, dst] = move.shortNotation.split(/x|-/);
                    const longNotation = move.longNotation;
                    state.doMove(origin, dst, longNotation);


                    const [_, evaluation] = this.maxValue(state, a, b, depth + 1);
                    v = Math.min(v, evaluation);
                    
                    // unmake move
                    state.undoLastMove();

                    if (v <= a) {
                        return [move, v];
                    }


                    if (v <= b) {
                        b = v;
                        moveToReturn = move;
                    }
                }
            }

            return [moveToReturn, v];
        }
    }

    getBoardEvaluation(state) {

        const winner = state.getWinner();
        if (winner) {
            return winner == CheckersGame.PLAYER_BLACK ? Infinity : -Infinity;
        }

        if (state.isDraw()) {
            return 0;
        }

        let utility = 0;
        for (let i = 1; i <= 32; i++) {
            const piece = state.getPieceAtPosition(i);
            if (piece) {
                let pieceVal = piece.color === CheckersGame.PLAYER_BLACK ? 1 : -1;
                if (piece.isKing) {
                    pieceVal *= 2;
                }
    
                utility += pieceVal;
            }
        }

        return utility;
    }

    getNextMove() {
        if (this.game.turn == CheckersGame.PLAYER_BLACK) {
            return this.maxValue(this.game, -Infinity, Infinity, 0);
        } else {
            return this.minValue(this.game, -Infinity, Infinity, 0);
        }
    }
}