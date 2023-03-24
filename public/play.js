
const CheckersBoard = require('./VersusBoard')
const {io} = require('./socket-io.js');
let socket = io.connect("/", {
    withCredentials: false
});


let options;
let gameId;
let playerColor;
let timeouts = [];
const setInfoMessage = (text) => {
    document.getElementById('message').innerHTML = '';
    const msg = document.createElement('p');
    msg.innerHTML = text;
    document.getElementById('message').appendChild(msg);
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
        const resign = document.createElement('button');
        resign.textContent = 'Resign';
        resign.setAttribute('id', 'resign');
        resign.setAttribute('data-cy', 'resign');
        const draw = document.createElement('button');
        draw.textContent = 'Offer draw';
        draw.setAttribute('id', 'offer-draw');
        draw.setAttribute('data-cy', 'offer-draw');

        document.getElementById('button-span').appendChild(resign);
        document.getElementById('button-span').appendChild(draw);


        playerColor = color;
        setInfoMessage("Game started. Black's turn");
        document.getElementById('board').remove();
        const newBoard = `<checkers-board id="board" data-cy="board" color="${color}"></checkers-board>`;
        const contentDiv = document.getElementById('content');

        contentDiv.innerHTML = newBoard + contentDiv.innerHTML;

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
    },

    onMove({moveOptions, fen, completedMoves})  {

        setInfoMessage('');
        const drawButtons = document.getElementById('draw-buttons');
        if (drawButtons) {
            drawButtons.remove();
        }

        let board = document.querySelector('#board');
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
        setInfoMessage(`${reason}. ${result}.`);
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
        acceptDraw.innerText = 'accept';
        acceptDraw.onclick = (e) => {
            emittedEvents.respondDraw(gameId, true);
            document.getElementById('draw-buttons').remove();
        }

        const declineDraw = document.createElement('button');
        declineDraw.setAttribute('id', 'decline-draw');
        declineDraw.setAttribute('data-cy', 'decline-draw');
        declineDraw.innerText = 'decline';
        declineDraw.onclick = (e) => {
            emittedEvents.respondDraw(gameId, false);
            document.getElementById('draw-buttons').remove();
        }

        const drawButtons = document.createElement('div');
        drawButtons.setAttribute('id', 'draw-buttons');
        drawButtons.setAttribute('data-cy', 'draw-buttons');

        drawButtons.appendChild(acceptDraw);
        drawButtons.appendChild(declineDraw);

        document.getElementById('info-box').insertBefore(drawButtons, document.getElementById('buttons'));
    },

    onDrawDeclined({id, color}) {
        const player = color === 'b' ? 'Black' : 'White';
        setInfoMessage(`${player} declined draw offer`);

        const drawButtons = document.createElement('div');
        if (drawButtons) {
            drawButtons.remove();
        }

    },

    onPlayerDisconnect({}) {
        timeouts = [];
        for (let i = 0; i < 10; i++) {
            timeouts.push(setTimeout(() => setInfoMessage(`Opponent left the game. You can claim a win in ${10 - i} seconds...`), 1000 * i));
        }

        timeouts.push(setTimeout(() => {
            setInfoMessage('Opponent left the game.');
            const claimWin = document.createElement('button');
            
            claimWin.setAttribute('id', 'claim-win');
            claimWin.setAttribute('data-cy', 'claim-win');
            claimWin.innerText = 'claim win';
            
            claimWin.onclick = (e) => {
                emittedEvents.claimWin(gameId);
                document.getElementById('end-buttons').remove();
            }

            const callDraw = document.createElement('button');
            
            callDraw.setAttribute('id', 'call-draw');
            callDraw.setAttribute('data-cy', 'call-draw');
            callDraw.innerText = 'call draw';
            
            callDraw.onclick = (e) => {
                emittedEvents.callDraw(gameId);
                document.getElementById('end-buttons').remove();
            }

            const endButtons = document.createElement('div');
            endButtons.setAttribute('id', 'end-buttons');
            endButtons.setAttribute('data-cy', 'end-buttons');

            endButtons.appendChild(claimWin);
            endButtons.appendChild(callDraw);

            document.getElementById('info-box').insertBefore(endButtons, document.getElementById('buttons'));
        }, 10000));
    },

    onPlayerReconnect({moveOptions, fen, color}) {

        setInfoMessage('');
        timeouts.forEach(to => clearTimeout(to));
        if (document.getElementById('board').getAttribute('color') === '') {
            const resign = document.createElement('button');
            resign.textContent = 'Resign';
            resign.setAttribute('id', 'resign');
            resign.setAttribute('data-cy', 'resign');
            
            const draw = document.createElement('button');
            draw.textContent = 'Offer draw';
            draw.setAttribute('id', 'offer-draw');
            draw.setAttribute('data-cy', 'offer-draw');
            document.getElementById('button-span').appendChild(resign);
            document.getElementById('button-span').appendChild(draw);

            document.getElementById('board').remove();
            const newBoard = `<checkers-board id="board" data-cy="board" color="${color}"></checkers-board>`;
            const contentDiv = document.getElementById('content');

            contentDiv.innerHTML = newBoard + contentDiv.innerHTML;

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
        } else {
            const endButtons = document.getElementById('end-buttons');
            if (endButtons) {
                endButtons.remove();
            }
        }
        
    }

}

if (window.Cypress) {
    window.socketHandlers = socketHandlers;
    window.emittedEvents = emittedEvents;
}


socket.on('startGame', socketHandlers.onStartGame);

socket.on('move', socketHandlers.onMove);

socket.on('gameOver', socketHandlers.onGameOver);

socket.on('offerDraw', socketHandlers.onOfferDraw);

socket.on('drawDeclined', socketHandlers.onDrawDeclined);

socket.on('playerDisconnect', socketHandlers.onPlayerDisconnect);

socket.on('playerReconnect', socketHandlers.onPlayerReconnect);

window.addEventListener('load', (e) => {

    gameId = window.location.href.split('/').at(-1);
    emittedEvents.joinGame(gameId);
    if (window.Cypress) {
        window.gameId = gameId;
    }

});