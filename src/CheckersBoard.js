const {Piece} = require("./Piece");

class CheckersBoard {
    constructor() {
        this.squares = {};
        for (let i = 1; i <= 32; i++) {
            if (i < 13) {
                this.squares["" + i] = new Piece("b");
            } else if (i < 21) {
                this.squares["" + i] = null;
            } else {
                this.squares["" + i] = new Piece("w");
            }
        }
    }
}

module.exports = {
    CheckersBoard: CheckersBoard
};