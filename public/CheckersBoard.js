const CheckersGame = require('./CheckersGame');
const CheckersAi = require('./CheckersAi');

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

class CheckersBoard extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `<link rel="stylesheet" href="/board_styles.css" />`;
        this.game = new CheckersGame();
        this.moveOptions = null;
        this.moveOptionsPtr = null;
        this.ai = new CheckersAi(this.game);

        const color = this.getAttribute('color') || 'b';
        this.color = color;

        this.isLocked = false;
        let div = document.createElement("div");
        this.createDiv(div);

        this.drawBoard();
        this.game.start();
    }

    getFen() {
        return this.game.getFen();
    }

    getEval() {
        return this.ai.getNextMove();
    }

    undoLastMove() {
        this.game.undoLastMove();
        super.drawBoard();

    }

    lockBoard() {
        this.isLocked = true;
    }

    drawBoard() {
        for (let i = 1; i <= 32; i++) {
            const squareDiv = this.shadowRoot.querySelector(`[data-pos="${i}"]`);
            const pieceDiv = squareDiv.firstChild;
            pieceDiv.classList.remove(...pieceDiv.classList);
            pieceDiv.setAttribute('data-cy', '');

            const piece = this.game.getPieceAtPosition(i);
            if (piece) {
                let dataCy = 'piece';
                pieceDiv.classList.add("piece");
                
                pieceDiv.classList.add(piece.color === CheckersGame.PLAYER_BLACK ? "black" : "white");
                dataCy += piece.color === CheckersGame.PLAYER_BLACK ? " black" : " white";
                pieceDiv.classList.toggle("king", piece.isKing);
                dataCy += piece.isKing ? " king" : "";
                pieceDiv.setAttribute('data-cy', dataCy);
            }
        }
    }

    createDiv(div) {
        let pieceCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const squareDiv = document.createElement("div");
                if (row % 2 !== col % 2) {
                    const pos = this.color === CheckersGame.PLAYER_WHITE ? pieceCount + 1 : 32 - pieceCount;
                    pieceCount++;
                    squareDiv.setAttribute("data-pos", pos);
                    squareDiv.setAttribute("data-cy", `square-${pos}`)
                    const that = this;
                    squareDiv.onclick = function() { that.clickSquare(squareDiv.getAttribute("data-pos")) }
                    squareDiv.ondragover = function(e) { e.preventDefault();}
                    squareDiv.ondrop = function(e) { 
                        e.preventDefault();
                        squareDiv.click() }
                    const pieceDiv = document.createElement("div");
                    pieceDiv.draggable = true;
                    pieceDiv.ondragstart = function() { squareDiv.click() }
                    pieceDiv.ondrag = function(e) {e.preventDefault();}
                    squareDiv.appendChild(pieceDiv);
                }

                div.appendChild(squareDiv);
            }
        }

        div.setAttribute("id", "gameboard");
        div.setAttribute("data-cy", "gameboard");
        this.shadowRoot.appendChild(div);
    }


    setBoardFromFen(fen) {
        this.game.constructFromFen(fen);
        this.drawBoard();
    }

    clickSquare(position) {

        for (let i = 1; i <= 32; i++) {
            const squareDiv = this.shadowRoot.querySelector(`[data-pos="${i}"]`).firstChild;
            squareDiv.classList.remove("highlight");
            squareDiv.setAttribute('data-cy', squareDiv.getAttribute('data-cy').replace('highlight', ''));

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
        } else if (!this.isLocked && this.game.getPieceAtPosition(position) && this.game.getPieceAtPosition(position).color === this.color) {
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
            squareDiv.setAttribute('data-cy', squareDiv.getAttribute('data-cy') + " highlight");
        });
    }
}

customElements.define('checkers-board', CheckersBoard);

module.exports = CheckersBoard;