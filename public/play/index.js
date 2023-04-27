const CheckersBoard = require('../CheckersBoard')
import {challengeSocketHandlers, registerChallengeHandlers} from "../challenge";
const {io} = require('../socket.io.js');

let options;
const gameId = window.location.href.split('/').at(-1);
let playerColor;
let timeouts = [];
let vsCpu;

let socket = io.connect("/", {
    withCredentials: true
});

socket.on('connect', () => {
    emittedEvents.joinGame(gameId);
});

socket.on('disconnect', (reason) => {
    console.log(`socket disconnected. reason: ${reason}`);
});

const setInfoMessage = (text) => {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';
    const msgText = document.createElement('p');
    msgText.innerHTML = text;
    messageDiv.appendChild(msgText);

    messageDiv.setAttribute('data-visible', '');
}

const clearMessage = () => {
    document.getElementById('message').removeAttribute('data-visible');
}

const showDefaultButtons = () => {

    const buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = '';

    const resign = document.createElement('button');
    resign.textContent = 'Resign';
    resign.setAttribute('id', 'resign');
    resign.setAttribute('data-cy', 'resign');
    resign.classList.add('button');
    resign.onclick = (e) => {
        emittedEvents.resign(gameId);
    };


    const draw = document.createElement('button');
    draw.textContent = 'Offer draw';
    draw.setAttribute('id', 'offer-draw');
    draw.setAttribute('data-cy', 'offer-draw');
    draw.classList.add('button');
    draw.toggleAttribute('data-visible', !vsCpu);
    draw.onclick = (e) => {
        emittedEvents.offerDraw(gameId);
    };


    buttonsDiv.appendChild(resign);
    buttonsDiv.appendChild(draw);

}

const emittedEvents = {
    joinGame: (id) => socket.emit('joinGame', {id}),
    makeMove: (move, id) => socket.emit('makeMove', {move, id}),
    resign: (id) => socket.emit('resign', {id}),
    offerDraw: (id) => socket.emit('offerDraw', {id}),
    respondDraw: (id, accept) => socket.emit('respondDraw', {id, accept}),
    claimWin: (id) => socket.emit('claimWin', {id}),
    callDraw: (id) => socket.emit('callDraw', {id})
}
const socketHandlers = {
    onStartGame({moveOptions, color}) {


        showDefaultButtons();

        playerColor = color;
        setInfoMessage("Game started. Black's turn");
        document.getElementById('board').remove();
        const newBoard = `<checkers-board id="board" data-cy="board" color="${color}"></checkers-board>`;
        const boardWrapper = document.querySelector('#board-wrapper');

        boardWrapper.innerHTML = newBoard;

        const board = document.getElementById('board');
    
        board.addEventListener("move", (e) => {
            const moveText = e.detail.moveText;
            const move = options.find(op => op.shortNotation === moveText || op.longNotation === moveText);
            emittedEvents.makeMove(move, gameId);
        });

        options = moveOptions;
    },

    onMove({moveOptions, fen, completedMoves})  {

        clearMessage();
        showDefaultButtons();

        let board = document.querySelector('#board');
        board.lastMove = completedMoves.at(-1).shortNotation.split(/x|-/);
        board.setBoardFromFen(fen);
        options = moveOptions;
    },

    onGameOver({gameId, result, reason}) {
        if (result === 'd') {
            result = "Draw.";
        } else {
            result = result === 'b' ? "Black wins." : "White wins.";
        }

        document.getElementById('board').lockBoard();
        setInfoMessage(`${reason ? reason + "." : ''} ${result}`);

        const buttonContainer = document.getElementById('buttons');
        buttonContainer.innerHTML = '';
        const analyzeButton = document.createElement('button');
        analyzeButton.setAttribute('id', 'analyze');
        analyzeButton.setAttribute('data-cy', 'analyze');
        analyzeButton.classList.add('button');
        analyzeButton.addEventListener('click', (e) => {
            window.location = `/analyze?g=${gameId}`;
        });
        analyzeButton.textContent = 'Analyze';
        buttonContainer.appendChild(analyzeButton);

    },

    onOfferDraw({id, color}) {
        if (color === playerColor) {
            setInfoMessage(`${color === 'b' ? 'Black' : 'White'} offered draw.`);
            return;
        }

        setInfoMessage(`Opponent is offering draw. Accept?`);
        const acceptDraw = document.createElement('button');
        acceptDraw.setAttribute('id', 'accept-draw');
        acceptDraw.setAttribute('data-cy', 'accept-draw');
        acceptDraw.classList.add('button');
        acceptDraw.innerText = 'accept';
        acceptDraw.onclick = (e) => {
            emittedEvents.respondDraw(gameId, true);
            showDefaultButtons();
        }

        const declineDraw = document.createElement('button');
        declineDraw.setAttribute('id', 'decline-draw');
        declineDraw.setAttribute('data-cy', 'decline-draw');
        declineDraw.classList.add('button');
        declineDraw.innerText = 'decline';
        declineDraw.onclick = (e) => {
            emittedEvents.respondDraw(gameId, false);
            showDefaultButtons();
        }

        const buttonsDiv = document.getElementById('buttons');
        buttonsDiv.innerHTML = '';
        buttonsDiv.appendChild(acceptDraw);
        buttonsDiv.appendChild(declineDraw);
    },

    onDrawDeclined({id, color}) {
        const player = color === 'b' ? 'Black' : 'White';
        setInfoMessage(`${player} declined draw offer`);

        showDefaultButtons();
    },

    onPlayerDisconnect({}) {
        const board = document.getElementById('board');
        if (board.isLocked) {
            return;
        }

        timeouts = [];
        for (let i = 0; i < 10; i++) {
            timeouts.push(setTimeout(() => setInfoMessage(`Opponent left the game. You can claim a win in ${10 - i} seconds...`), 1000 * i));
        }

        timeouts.push(setTimeout(() => {
            setInfoMessage('Opponent left the game.');
            const claimWin = document.createElement('button');
            
            claimWin.setAttribute('id', 'claim-win');
            claimWin.setAttribute('data-cy', 'claim-win');
            claimWin.classList.add('button');
            claimWin.innerText = 'claim win';
            
            claimWin.onclick = (e) => {
                emittedEvents.claimWin(gameId);
                showDefaultButtons();
            }

            const callDraw = document.createElement('button');
            
            callDraw.setAttribute('id', 'call-draw');
            callDraw.setAttribute('data-cy', 'call-draw');
            callDraw.classList.add('button');
            callDraw.innerText = 'call draw';
            
            callDraw.onclick = (e) => {
                emittedEvents.callDraw(gameId);
                showDefaultButtons();
            }

            const buttonsDiv = document.getElementById('buttons');
            buttonsDiv.innerHTML = '';
            buttonsDiv.appendChild(claimWin);
            buttonsDiv.appendChild(callDraw);

        }, 10000));
    },

    onPlayerReconnect({moveOptions, fen, color}) {
        showDefaultButtons();
        clearMessage();
        timeouts.forEach(to => clearTimeout(to));
        if (document.getElementById('board').getAttribute('color') === '') {

            document.getElementById('board').remove();
            const newBoard = `<checkers-board id="board" data-cy="board" color="${color}"></checkers-board>`;
            const boardWrapper = document.getElementById('board-wrapper');

            boardWrapper.innerHTML = newBoard;

            const board = document.getElementById('board');
        
            board.addEventListener("move", (e) => {
                const moveText = e.detail.moveText;
                const move = options.find(op => op.shortNotation === moveText || op.longNotation === moveText);
                emittedEvents.makeMove(move, gameId);
            });

            const resignButton = document.getElementById('resign');
            resignButton.onclick = (e) => {
                emittedEvents.resign(gameId);
            };

            const drawButton = document.getElementById('offer-draw');
            drawButton.onclick = (e) => {
                emittedEvents.offerDraw(gameId);
            }

            options = moveOptions;

            board.setBoardFromFen(fen);
        }
    }
}

if (window.Cypress) {
    window.socketHandlers = socketHandlers;
    window.challengeSocketHandlers = challengeSocketHandlers;
    window.emittedEvents = emittedEvents;
}

registerChallengeHandlers(socket);
socket.on('startGame', socketHandlers.onStartGame);

socket.on('move', socketHandlers.onMove);

socket.on('gameOver', socketHandlers.onGameOver);

socket.on('offerDraw', socketHandlers.onOfferDraw);

socket.on('drawDeclined', socketHandlers.onDrawDeclined);

socket.on('playerDisconnect', socketHandlers.onPlayerDisconnect);

socket.on('playerReconnect', socketHandlers.onPlayerReconnect);



window.addEventListener('load', async (e) => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    mobileNavToggle.addEventListener('click', () => {
        nav.toggleAttribute('data-visible');
        mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
    });

    if (window.Cypress) {
        window.gameId = gameId;
    }

    setInfoMessage('Waiting for players');

    if (!window.Cypress) {
        const game = await fetch(`/api/game/${gameId}`, {method: 'GET'});
        if (game) {
            const body = await game.json();
            if (body.gameState === 'completed') {
                window.location = `/analyze?g=${gameId}`;
                return;
            }
    
            vsCpu = body.vsCpu;
            const drawButton = document.getElementById('offer-draw');
            if (drawButton) {
                drawButton.toggleAttribute('data-visible', !vsCpu);
            }
        }
    }
});