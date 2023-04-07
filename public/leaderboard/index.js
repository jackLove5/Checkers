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
    },
    onChallengeStart({gameId}) {
        window.location = `/play/${gameId}`;
    },
    
    onChallengeRequest({challenge}) {
    
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
};

socket.on('onlineUsers', socketHandlers.onOnlineUsers);
socket.on('challengeStart', socketHandlers.onChallengeStart);
socket.on('challengeRequest', socketHandlers.onChallengeRequest);

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
        /*const playerDiv = document.createElement('div');
        playerDiv.setAttribute('data-cy', 'player');
        playerDiv.classList.add('player');
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
        playerDiv.append(rating);*/

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