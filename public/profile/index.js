let socket = io.connect("/", {
    withCredentials: true
});

const emittedEvents = {
    createChallenge: (receiverName, isRanked, color) => {
        socket.emit('createChallenge', {receiverName, isRanked, color});

    }
}

const socketHandlers = {
    onChallengeStart({gameId}) {
        window.location = `/play/${gameId}`;
    },

    onChallengeRejected() {
        const detail = `<p>Challenge rejected</p>`;

        const challengeDetail = document.createElement('p');
        challengeDetail.innerHTML = detail;

        const challengeDiv = document.createElement('div');
        challengeDiv.setAttribute('data-cy', 'challenge-reject');


        challengeDiv.appendChild(challengeDetail);
        document.getElementById('notifications').appendChild(challengeDiv);
    }
}

socket.on('challengeStart', socketHandlers.onChallengeStart);
socket.on('challengeRejected', socketHandlers.onChallengeRejected);

if (window.Cypress) {
    window.emittedEvents = emittedEvents;
    window.socketHandlers = socketHandlers;
}
window.addEventListener('load', async (e) => {

    const username = new URLSearchParams(window.location.search).get('u');

    const res = await fetch(`/api/user/${username}`,{
        method: 'GET'
    });

    if (res.status === 400) {
        document.write('bad request');
        return;
    } else if (res.status === 404) {
        document.write('user not found');
        return;
    }

    const resJson = await res.json();
    document.getElementById('username').textContent = resJson.username;

    const challengeButton = document.getElementById('challenge');

    challengeButton.addEventListener('click', (e) => {
        const createChallengeDiv = document.createElement('div');
        createChallengeDiv.setAttribute('data-cy', 'create-challenge');

        let color, isRanked;
        isRanked = true;
        const ranked = document.createElement('div');
        ranked.setAttribute('data-cy', 'ranked');
        ranked.textContent = 'Ranked';
        ranked.addEventListener('click', (e) => isRanked = true);

        const unranked = document.createElement('div');
        unranked.textContent = 'Unranked';
        unranked.setAttribute('data-cy', 'unranked');
        unranked.addEventListener('click', (e) => isRanked = false);

        const black = document.createElement('div');
        black.textContent = 'black';
        black.setAttribute('data-cy', 'black');
        black.addEventListener('click', (e) => color = 'b');

        const white = document.createElement('div');
        white.textContent = 'white';
        white.setAttribute('data-cy', 'white');
        white.addEventListener('click', (e) => color = 'w');

        const randomColor = document.createElement('div');
        randomColor.textContent = 'random';
        randomColor.setAttribute('data-cy', 'random');
        randomColor.addEventListener('click', (e) => color = undefined);

        const close = document.createElement('div');
        close.textContent = 'X';
        close.setAttribute('data-cy', 'close');
        close.addEventListener('click', (e) => {
            createChallengeDiv.remove();
        });


        const send = document.createElement('div');
        send.setAttribute('data-cy', 'send');
        send.textContent = 'send challenge';
        send.addEventListener('click', (e) => {
            emittedEvents.createChallenge(document.getElementById('username').textContent, isRanked, color);
            createChallengeDiv.remove();
        });
        
        createChallengeDiv.appendChild(close);


        createChallengeDiv.appendChild(ranked);
        createChallengeDiv.appendChild(unranked);
        createChallengeDiv.appendChild(black);
        createChallengeDiv.appendChild(randomColor);
        createChallengeDiv.appendChild(white);
        createChallengeDiv.appendChild(send);

        document.getElementById('create-box').appendChild(createChallengeDiv);

        socket.on('challengeStart', ({gameId}) => {
            window.location = `/play/${gameId}`;
        });
    });
})