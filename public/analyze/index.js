
const CheckersBoard = require('../CheckersBoard');
const CheckersAi = require('../CheckersAi');
const CheckersGame = require('../CheckersGame');
import { registerChallengeHandlers } from '../challenge';
let socket = io.connect("/", {
    withCredentials: true
});

registerChallengeHandlers(socket);

const analyzeGame = new CheckersGame();
analyzeGame.start();
const initialFen = analyzeGame.getFen();
const ai = new CheckersAi(analyzeGame);



window.addEventListener('load', async (e) => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    mobileNavToggle.addEventListener('click', () => {
        nav.toggleAttribute('data-visible');
        mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
    });

    const gameId = new URLSearchParams(window.location.search).get('g');
    const res = await fetch (`/api/game/${gameId}`, { method: 'GET'});

    if (res.status === 400) {
        document.write('bad request');
        return;
    } else if (res.status === 404) {
        document.write('game not found');
        return;
    }

    const resObj = await res.json();
    const moves = resObj.moves.map(json => JSON.parse(json));
    
    let board = document.querySelector('#board');

    let states = [];

    const game = new CheckersGame();
    game.start();
    moves.forEach((move) => {
        const [src, dst] = move.shortNotation.split(/-|x/);
        game.doMove(src, dst, move.longNotation);
        states.push({
            bestMove: '',
            evaluation: '',
            moveText: move.longNotation,
            fen: game.getFen()
        });
    });

    for (let i = 0; i < states.length; i++) {
        const moveList = document.querySelector('#move-list');
        if (i % 2 === 0) {
            const moveNumberNode = document.createElement("p");
            moveNumberNode.innerHTML = `${i / 2 + 1}.`;
            moveList.appendChild(moveNumberNode);
        }

        const moveNode = document.createElement("p");
        moveNode.setAttribute('data-index', i);
        moveNode.setAttribute('data-cy', `move-${i}`);
        
        moveNode.innerText = states[i].moveText;
        moveNode.classList.add('clickable');
        moveNode.addEventListener('click', (e) => {

            if (states[i].bestMove === '') {
                analyzeGame.constructFromFen(i === 0 ? initialFen : states[i - 1].fen);
                let [bestMove, evaluation] = ai.getNextMove();
                if (bestMove) {
                    states[i].bestMove = bestMove;
                }

                if (i > 0) {
                    states[i - 1].evaluation = evaluation;
                }

            }

            if (states[i].evaluation === '') {
                analyzeGame.constructFromFen(states[i].fen);
                let [bestMove, evaluation] = ai.getNextMove();

                if (bestMove && i + 1 < states.length) {
                    states[i + 1].bestMove = bestMove;
                }

                states[i].evaluation = evaluation;
            }

            const selectedMove = document.querySelector('#move-list .selected-move');
            if (selectedMove) {
                selectedMove.classList.remove('selected-move');
            }

            e.target.classList.add('selected-move');

            const lastMove = states[i].moveText.split(/x|-/);
            board.lastMove = [lastMove[0], lastMove[lastMove.length - 1]];
            board.bestMove = states[i].bestMove.shortNotation.split(/x|-/);
            board.setBoardFromFen(states[i].fen);
            board.drawBoard();

            document.getElementById("eval").innerHTML = `eval: ${states[i].evaluation}. Best Move: ${states[i].bestMove.longNotation}`;
        });

        moveList.appendChild(moveNode);
    }

    const firstMove = document.querySelector('[data-index="0"]');
    if (firstMove) {
        firstMove.click();
    }

    board.toggleNumbers();
});