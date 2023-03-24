import { CheckersBoard } from "./VersusBoard.js";

window.addEventListener('load', (e) => {
    let board = document.querySelector('#board');
    board.addEventListener("win", (e) => {
        const text = e.detail.text;
        document.querySelector("#winner").innerHTML = text;
    
    });
    
    board.addEventListener("move", (e) => {
        const moveList = document.querySelector('#move-list');
        const moves = document.querySelectorAll('#move-list .move');
        const moveCount = moves ? moves.length : 0;
        if (moveCount % 2 === 0) {
            const moveNumberNode = document.createElement("p");
            moveNumberNode.innerHTML = `${moveCount / 2 + 1}.`;
            moveList.appendChild(moveNumberNode);
        }

        const moveText = e.detail.moveText;
        const moveNode = document.createElement("p");
        const selectedMove = document.querySelector('#move-list .selected-move');

        if (selectedMove) {
            selectedMove.classList.remove('selected-move');
        }
        moveNode.classList.add('move', 'selected-move');
        moveNode.setAttribute('data-index', moveCount);
        moveNode.setAttribute('data-cy', `move-${moveCount}`)
        moveNode.addEventListener('click', (e) => {
            const selectedMove = document.querySelector('#move-list .selected-move');
            const currentIndex = parseInt(selectedMove.getAttribute('data-index'));
            const clickedIndex = parseInt(e.target.getAttribute('data-index'));
            selectedMove.classList.remove('selected-move');

            const allMoves = Array.from(document.querySelectorAll('#move-list .move'));
            if (currentIndex < clickedIndex) {
                for (let i = currentIndex + 1; i <= clickedIndex; i++) {
                    const moveText = allMoves[i].textContent;
                    const squares = moveText.split(/x|-/);
                    const src = squares.at(0);
                    const dst = squares.at(-1);
                    board.game.doMove(src, dst, moveText)
                }
            } else {
                for (let i = currentIndex; i > clickedIndex; i--) {
                    board.undoLastMove();
                }
            }

            board.drawBoard();
            const [bestMove, evaluation] = board.getEval();
            document.getElementById("eval").innerHTML = `eval: ${evaluation}. Best Move: ${bestMove.longNotation}`;

            e.target.classList.add('selected-move');

        })
        moveNode.innerHTML = moveText;
        moveList.appendChild(moveNode);
    });


    const winnerDiv = document.createElement("div");
    winnerDiv.setAttribute("id", "winner");

    document.body.appendChild(winnerDiv);

    const botButton = document.getElementById("bot");
    const evalLabel = document.getElementById("eval");
    botButton.addEventListener("click", (e) => {
        const moves = Array.from(document.querySelectorAll('.move'));
        if (moves.length > 0) {
            moves.at(-1).click();
        }
        const evaluation = board.doBotMove();
        evalLabel.innerHTML = `board evaluation: ${evaluation}`;
    });
});