import { CheckersGame } from "./CheckersGame.js";

class MoveOptions {
    constructor() {
        this.root = {
            val: null,
            children: {}
        }

        this.leaves = {};
    }

    insertMove(move) {
        const subJumps = move.longNotation.split(/x|-/);
        let ptr = this.root;
        for (let i = 0; i < subJumps.length; i++) {

            if (!(subJumps[i] in ptr.children)) {
                ptr.children[subJumps[i]] = {
                    val: subJumps[i],
                    move: null,
                    children: {}
                }
            }

            ptr = ptr.children[subJumps[i]];
        }

        ptr.move = move;
        const dst = subJumps[subJumps.length-1];
        this.leaves[dst] = this.leaves[dst] ? this.leaves[dst] + 1 : 1;
    }
}

export class CheckersBoard extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `<link rel="stylesheet" href="./board_styles.css" />`;
        this.game = new CheckersGame();
        this.moveOptions = null;
        this.moveOptionsPtr = null;
        let div = document.createElement("div");
        this.createDiv(div);
        this.game.start();
        this.drawBoard();
    }

    drawBoard() {
        for (let i = 1; i <= 32; i++) {
            const squareDiv = this.shadowRoot.querySelector(`[data-pos="${i}"]`);
            const pieceDiv = squareDiv.firstChild;
            pieceDiv.classList.remove(...pieceDiv.classList);

            const piece = this.game.getPieceAtPosition(i);
            if (piece) {
                pieceDiv.classList.add("piece");
                pieceDiv.classList.add(piece.color === CheckersGame.PLAYER_BLACK ? "black" : "white");
                pieceDiv.classList.toggle("king", piece.isKing);
            }
        }
    }

    createDiv(div) {
        let pieceCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const squareDiv = document.createElement("div");
                if (row % 2 !== col % 2) {
                    squareDiv.setAttribute("data-pos", ++pieceCount);
                    const that = this;
                    squareDiv.onclick = function() { that.clickSquare(squareDiv.getAttribute("data-pos")) }
                    const pieceDiv = document.createElement("div");
                    squareDiv.appendChild(pieceDiv);
                }

                div.appendChild(squareDiv);
            }
        }

        div.setAttribute("id", "gameboard");
        this.shadowRoot.appendChild(div);
    }


    clickSquare(position) {

        for (let i = 1; i <= 32; i++) {
            const squareDiv = this.shadowRoot.querySelector(`[data-pos="${i}"]`).firstChild;
            squareDiv.classList.remove("highlight");
        }

        let destinationSquares = [];
        if (this.moveOptions) {
            if (Object.keys(this.moveOptionsPtr.children).includes(position)) {
                this.moveOptionsPtr = this.moveOptionsPtr.children[position];
            
                while (Object.keys(this.moveOptionsPtr.children).length == 1) {
                    const children = this.moveOptionsPtr.children;
                    this.moveOptionsPtr = children[Object.values(children)[0].val];
                }


                destinationSquares = Object.values(this.moveOptionsPtr.children).map(obj => obj.val);
                if (destinationSquares.length == 0) {

                    const dst = this.moveOptionsPtr.val;
                    const origin = this.moveOptionsPtr.move.shortNotation.split(/-|x/)[0];
                    const isLongNotationNeeded = this.moveOptions.leaves[dst] > 1;
                    let moveText = '';
                    if (isLongNotationNeeded) {
                        this.game.doMove(origin, dst, this.moveOptionsPtr.move.longNotation);
                        moveText = this.moveOptionsPtr.move.longNotation;
                    } else {
                        this.game.doMove(origin, dst);
                        moveText = this.moveOptionsPtr.move.shortNotation;
                    }

                    const moveEvent = new CustomEvent('move', { 
                        bubbles: true,
                        detail: { moveText },
                      });
                    
                    this.dispatchEvent(moveEvent);  
                    
                    this.drawBoard();
                    this.moveOptionsPtr = null;
                    this.moveOptions = null;

                    if (this.game.getWinner()) {
                        const text = this.game.getWinner() === CheckersGame.PLAYER_BLACK ? "Black Wins!" : "White Wins!";
                        const winEvent = new CustomEvent('win', {
                            bubbles: true,
                            detail: { text }
                        });

                        this.dispatchEvent(winEvent);
                    }
                }

            } else {
                this.moveOptionsPtr = null;
                this.moveOptions = null;
            }
        } else {
            const validMoves = this.game.getPlayableMovesByPosition(position);
            if (validMoves.length > 0) {
                this.moveOptions = new MoveOptions();
                this.moveOptionsPtr = this.moveOptions.root;

                validMoves.forEach(move => this.moveOptions.insertMove(move));

                this.moveOptionsPtr = this.moveOptionsPtr.children[position];
                destinationSquares = Object.values(this.moveOptionsPtr.children).map(obj => obj.val);
            }
        }

        destinationSquares.forEach(ds => {
            const squareDiv = this.shadowRoot.querySelector(`[data-pos="${ds}"]`).firstChild;
            squareDiv.classList.add("highlight");
        });
    }
}

customElements.define('checkers-board', CheckersBoard);