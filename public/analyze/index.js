
const CheckersBoard = require('../CheckersBoard');
const CheckersAi = require('../CheckersAi');
const CheckersGame = require('../CheckersGame');
let socket = io.connect("/", {
    withCredentials: true
});


const analyzeGame = new CheckersGame();
analyzeGame.start();
const initialFen = analyzeGame.getFen();
const ai = new CheckersAi(analyzeGame);

const onChallengeStart = ({gameId}) => {
    window.location = `/play/${gameId}`;
}

const onChallengeRequest = ({challenge}) => {

    const detail = `<p>${challenge.senderName} is challenging you</p>
     <p>${challenge.isRanked ? 'Ranked' : 'Unranked'}</p>
     <p>You play ${challenge.playerBlack === challenge.receiverName ? 'Black' : 'White'} pieces
    `;

    const challengeDetail = document.createElement('p');
    challengeDetail.innerHTML = detail;

    const challengeDiv = document.createElement('div');
    challengeDiv.setAttribute('data-cy', 'challenge-request');

    const acceptChallenge = document.createElement('p');
    acceptChallenge.setAttribute('data-cy', 'challenge-accept');
    acceptChallenge.innerText = 'Accept';
    acceptChallenge.addEventListener('click', (e) => {
        emittedEvents.respondToChallenge(challenge._id, true);
    });

    const rejectChallenge = document.createElement('p');
    rejectChallenge.setAttribute('data-cy', 'challenge-reject');
    rejectChallenge.innerText = 'Reject';
    rejectChallenge.addEventListener('click', (e) => {
        emittedEvents.respondToChallenge(challenge._id, false);
        challengeDiv.remove();
    });

    challengeDiv.appendChild(challengeDetail);
    const respondDiv = document.createElement('div');
    respondDiv.classList.add('response-options');
    respondDiv.appendChild(acceptChallenge);
    respondDiv.appendChild(rejectChallenge);

    challengeDiv.appendChild(respondDiv);
    document.getElementById('notifications').appendChild(challengeDiv);
}

socket.on('challengeStart', onChallengeStart);
socket.on('challengeRequest', onChallengeRequest)

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
        moveNode.addEventListener('click', (e) => {

            if (states[i].bestMove === '') {
                analyzeGame.constructFromFen(i === 0 ? initialFen : states[i - 1].fen);
                const [bestMove, evaluation] = ai.getNextMove();
                if (bestMove) {
                    states[i].bestMove = bestMove;
                }

                states[i].evaluation = evaluation;
            }
            const selectedMove = document.querySelector('#move-list .selected-move');
            if (selectedMove) {
                selectedMove.classList.remove('selected-move');
            }

            e.target.classList.add('selected-move');

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
});