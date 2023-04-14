import { registerChallengeHandlers, challengeSocketHandlers } from '/challenge.js';

let socket = io.connect("/", {
    withCredentials: true
});

let onlineUsers = new Set();

const updateOnlineStatuses = () => {
    const playerList = Array.from(document.querySelectorAll('[data-username]'));
    playerList.forEach((playerRow) => {

        const username = playerRow.getAttribute('data-username');
        const isOnline = onlineUsers.has(username);
        
        const onlineDiv = document.querySelector(`[data-username="${username}"] .online`);
        onlineDiv.toggleAttribute('data-visible', isOnline);
    });
}

const socketHandlers = {

    onOnlineUsers({usernames}) {
        onlineUsers = new Set(usernames);
        updateOnlineStatuses();
    }
};

socket.on('onlineUsers', socketHandlers.onOnlineUsers);
registerChallengeHandlers(socket);

const api = {
    async getRankings(){
        const res = await fetch('/api/rankings', {method: 'GET'});
        const {users} = await res.json();

        return users;
    }
}



const displayRankings = async () => {
    const users = await api.getRankings();

    users.forEach((user, i) => {

        const uname = user.username;
        const playerRow = document.createElement('tr');
        playerRow.classList.add('player');
        playerRow.setAttribute('data-cy', 'player');
        playerRow.setAttribute('data-username', uname);

        const cols = `<td class="rank" data-cy="rank">${i+1}</td>
                      <td class="username"><div class="online"></div><a href="/profile?u=${uname}">${uname}</a></td>
                      <td class="rating" data-cy="rating">${user.rating}</td>`;
        playerRow.innerHTML = cols;

        document.getElementById('player-list').appendChild(playerRow);

    });

    updateOnlineStatuses();
}

if (window.Cypress) {
    window.socketHandlers = socketHandlers;
    window.api = api;
    window.displayRankings = displayRankings;
} else {
    window.addEventListener('load', displayRankings);
}

window.addEventListener('load', (e) => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    mobileNavToggle.addEventListener('click', () => {
        nav.toggleAttribute('data-visible');
        mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
    });
})