
const CheckersBoard = require('./CheckersBoard');

let socket = io.connect("/", {
    withCredentials: true
});

const emittedEvents = {
    respondToChallenge: (challengeId, accept) => socket.emit('respondToChallenge', {challengeId, accept})
};

const socketHandlers = {
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
    },
    
    onOnlineUsers({usernames}) {
        //alert(JSON.stringify(usernames));
    },
    onChallengeRejected() {
        //alert('challengeRejected')
    }
};

socket.on('challengeStart', socketHandlers.onChallengeStart);
socket.on('challengeRequest', socketHandlers.onChallengeRejected);
socket.on('challengeRejected', socketHandlers.onChallengeRejected);
socket.on('onlineUsers', socketHandlers.onOnlineUsers);

if (window.Cypress) {
    window.socketHandlers = socketHandlers;
    window.emittedEvents = emittedEvents;
}

window.addEventListener('load', (e) => {

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    mobileNavToggle.addEventListener('click', () => {
        nav.toggleAttribute('data-visible');
        mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
    });

    const playAgainstFriendButton = document.getElementById('play-friend');

    playAgainstFriendButton.onclick = async (e) => {
        const resp = await fetch('/api/game/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isRanked: false, vsCpu: false})
        });


        const json = await resp.json();
        window.location = `/play/${json._id}`;
    };

    const playAgainstCompButton = document.getElementById('play-comp');

    playAgainstCompButton.onclick = async (e) => {
        const resp = await fetch('/api/game/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isRanked: false, vsCpu: true})
        });

        const json = await resp.json();
        window.location = `/play/${json._id}`;
    }

    document.getElementById('checkers-board').lockBoard();
});