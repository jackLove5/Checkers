import { CheckersBoard } from "./CheckersBoard.js";

window.addEventListener('load', (e) => { 
    const board = document.createElement("checkers-board");

    board.addEventListener("win", (e) => {
        const text = e.detail.text;
        document.querySelector("#winner").innerHTML = text;
    
    });
    
    board.addEventListener("move", (e) => {
        const moveText = e.detail.moveText;
        const pNode = document.createElement("p");
        pNode.innerHTML = moveText;
        document.querySelector("#moves").appendChild(pNode);
    });

    const movesDiv = document.createElement("div");
    movesDiv.setAttribute("id", "moves");

    const winnerDiv = document.createElement("div");
    winnerDiv.setAttribute("id", "winner");

    document.body.appendChild(board);
    document.body.appendChild(movesDiv);
    document.body.appendChild(winnerDiv);

    const botButton = document.getElementById("bot");
    const evalLabel = document.getElementById("eval");
    botButton.addEventListener("click", (e) => {
        const evaluation = board.doBotMove();
        evalLabel.innerHTML = `board evaluation: ${evaluation}`;
    });
});