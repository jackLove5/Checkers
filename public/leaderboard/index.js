let socket = io.connect("/", {
    withCredentials: true
});

let onlineUsers = new Set();

const updateOnlineStatuses = () => {
    const playerList = Array.from(document.querySelectorAll('[data-username]'));
    playerList.forEach((playerDiv) => {
        const username = playerDiv.getAttribute('data-username');
        const statusDiv = document.createElement('div');
        statusDiv.setAttribute('data-cy', 'status');
        const isOnline = onlineUsers.has(username);
        statusDiv.setAttribute('data-status', isOnline ? 'online' : 'offline');
        playerDiv.appendChild(statusDiv);
    });
}

const socketHandlers = {

    onOnlineUsers({usernames}) {
        onlineUsers = new Set(usernames);
        updateOnlineStatuses();
    }
};

socket.on('onlineUsers', socketHandlers.onOnlineUsers);

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
        const playerDiv = document.createElement('div');
        playerDiv.setAttribute('data-cy', 'player');
        playerDiv.setAttribute('data-username', user.username);
        const rank = document.createElement('div');
        rank.setAttribute('data-cy', 'rank');
        rank.textContent = `${i + 1}.`;
        
        const name = document.createElement('div');
        name.innerHTML = `<a href="/profile?u=${user.username}">${user.username}</a>`;
        
        const rating = document.createElement('div');
        rating.setAttribute('data-cy', 'rating');
        rating.textContent = user.rating;

        playerDiv.appendChild(rank);
        playerDiv.appendChild(name);
        playerDiv.append(rating);

        document.getElementById('player-list').appendChild(playerDiv);

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