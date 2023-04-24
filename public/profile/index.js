import { registerChallengeHandlers, challengeSocketHandlers } from '/challenge.js';

let socket = io.connect("/", {
    withCredentials: true
});

let onlineUsers = new Set();

const emittedEvents = {
    createChallenge: (receiverName, isRanked, color) => {
        socket.emit('createChallenge', {receiverName, isRanked, color});
    }
}

const socketHandlers = {
    onOnlineUsers({usernames}) {
        onlineUsers = new Set(usernames);

        const username = document.getElementById('username').innerText;
        const statusDiv = document.createElement('div');
        statusDiv.setAttribute('data-cy', 'status');
        const isOnline = onlineUsers.has(username);
        statusDiv.setAttribute('data-status', isOnline ? 'online' : 'offline');
        statusDiv.textContent = statusDiv.getAttribute('data-status');
        document.querySelector('body').appendChild(statusDiv);

        const userLoggedIn = document.getElementById('profile') ? document.getElementById('profile').textContent : '';
        const displayButton = userLoggedIn && username !== userLoggedIn && isOnline;
        document.getElementById('challenge').toggleAttribute('is-visible', displayButton)
    }
}

socket.on('onlineUsers', socketHandlers.onOnlineUsers);
registerChallengeHandlers(socket);

if (window.Cypress) {
    window.emittedEvents = emittedEvents;
    window.socketHandlers = socketHandlers;
    window.challengeSocketHandlers = challengeSocketHandlers;
}
window.addEventListener('load', async (e) => {

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    mobileNavToggle.addEventListener('click', () => {
        nav.toggleAttribute('data-visible');
        mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
    });

    const username = new URLSearchParams(window.location.search).get('u');

    const userRes = await fetch(`/api/user/${username}`,{
        method: 'GET'
    });

    if (userRes.status === 400) {
        document.write('bad request');
        return;
    } else if (userRes.status === 404) {
        document.write('user not found');
        return;
    }

    const userResJson = await userRes.json();
    document.getElementById('username').textContent = userResJson.username;

    const gamesRes = await fetch(`/api/game?u=${username}`, {method: 'GET'});
    if (gamesRes.status === 400) {
        document.write('bad request');
        return;
    }

    const gamesResJson = await gamesRes.json();

    gamesResJson.games.filter(game => game.gameState === 'completed').sort((a, b) => a._id < b._id ? 1 : -1).forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        gameDiv.setAttribute('data-cy', 'game');
        let playerBlackProfile, playerWhiteProfile;
        if (game.playerBlack === 'Computer' || game.playerBlack === 'Guest') {
            playerBlackProfile = game.playerBlack;
        } else {
            playerBlackProfile = `<a href="/profile?u=${game.playerBlack}">${game.playerBlack}</a> (${game.playerBlackRating})`;
        }

        if (game.playerWhite === 'Computer' || game.playerWhite === 'Guest') {
            playerWhiteProfile = game.playerWhite;
        } else {
            playerWhiteProfile= `<a href="/profile?u=${game.playerWhite}">${game.playerWhite}</a> (${game.playerWhiteRating})`;
        }
        
        const html = `<div class="versus">${playerBlackProfile} vs ${playerWhiteProfile}</div>
                      <div class="type">${game.isRanked ? 'Ranked' : 'Unranked'}</div>
                      <div class="result"> ${game.result === 'd' ? 'Draw' : (game.result === 'b' ? game.playerBlack : game.playerWhite) + " Wins"}</div>`;

        gameDiv.innerHTML = html;

        gameDiv.addEventListener('click', (e) => {
            window.location = `/analyze?g=${game._id}`;
        });
        document.getElementById('games').appendChild(gameDiv);
    })


    const challengeButton = document.getElementById('challenge');

    challengeButton.addEventListener('click', (e) => {
        if (document.getElementById('create-challenge')) {
            return;
        }

        const createChallengeDiv = document.createElement('div');
        createChallengeDiv.setAttribute('data-cy', 'create-challenge');
        createChallengeDiv.setAttribute('id', 'create-challenge');

        let color, isRanked;
        isRanked = true;
        const ranked = document.createElement('div');
        ranked.setAttribute('data-cy', 'ranked');
        ranked.classList.add('selected');
        ranked.textContent = 'Ranked';
        ranked.addEventListener('click', (e) => {
            isRanked = true;
            ranked.classList.add('selected');
            unranked.classList.remove('selected');
        });

        const unranked = document.createElement('div');
        unranked.textContent = 'Unranked';
        unranked.setAttribute('data-cy', 'unranked');
        unranked.addEventListener('click', (e) => {
            isRanked = false;
            unranked.classList.add('selected');
            ranked.classList.remove('selected');
        });

        const black = document.createElement('div');
        black.textContent = 'Black';
        black.setAttribute('data-cy', 'black');
        black.addEventListener('click', (e) => {
            color = 'b';
            white.classList.remove('selected');
            randomColor.classList.remove('selected');
            black.classList.add('selected');
        });

        const white = document.createElement('div');
        white.textContent = 'White';
        white.setAttribute('data-cy', 'white');
        white.addEventListener('click', (e) => {
            color = 'w';
            black.classList.remove('selected');
            randomColor.classList.remove('selected');
            white.classList.add('selected');
        });

        const randomColor = document.createElement('div');
        randomColor.textContent = 'Random';
        randomColor.setAttribute('data-cy', 'random');
        randomColor.classList.add('selected');
        randomColor.addEventListener('click', (e) => {
            color = undefined;
            black.classList.remove('selected');
            white.classList.remove('selected');
            randomColor.classList.add('selected');
        });

        const close = document.createElement('div');
        close.textContent = 'Cancel';
        close.setAttribute('data-cy', 'close');
        close.addEventListener('click', (e) => {
            createChallengeDiv.remove();
            document.getElementById('create-box').removeAttribute('data-visible');
        });


        const send = document.createElement('div');
        send.setAttribute('data-cy', 'send');
        send.textContent = 'Send';
        send.addEventListener('click', (e) => {
            emittedEvents.createChallenge(document.getElementById('username').textContent, isRanked, color);
            createChallengeDiv.remove();
            document.getElementById('create-box').removeAttribute('data-visible');
        });
        



        const typeDiv = document.createElement('div');
        typeDiv.setAttribute('id', 'challenge-type');
        typeDiv.appendChild(ranked);
        typeDiv.appendChild(unranked);

        const colorDiv = document.createElement('div');
        colorDiv.setAttribute('id', 'challenge-color');
        colorDiv.appendChild(black);
        colorDiv.appendChild(randomColor);
        colorDiv.appendChild(white);


        const sendOrCancelDiv = document.createElement('div');
        sendOrCancelDiv.appendChild(send);
        sendOrCancelDiv.appendChild(close);

        createChallengeDiv.appendChild(typeDiv);
        createChallengeDiv.appendChild(colorDiv);
        createChallengeDiv.appendChild(sendOrCancelDiv);

        document.getElementById('create-box').appendChild(createChallengeDiv);
        document.getElementById('create-box').setAttribute('data-visible', '');
    });
})