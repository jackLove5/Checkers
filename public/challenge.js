
const createEmittedEvents = (socket) => {
    return {
        respondToChallenge: (challengeId, accept) => socket.emit('respondToChallenge', {challengeId, accept})
    }
}

let emittedEvents = {};


const challengeSocketHandlers = {
    onChallengeStart({gameId}) {
        window.location = `/play/game/${gameId}`;
    },
    
    onChallengeRequest({challenge}) {
        console.log('in onChallengeRequest');
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
    
    onChallengeRejected() {
        //alert('challengeRejected') 
    }
};

const registerChallengeHandlers = function(socket) {
    emittedEvents = createEmittedEvents(socket);

    socket.on('challengeStart', challengeSocketHandlers.onChallengeStart);
    socket.on('challengeRequest', challengeSocketHandlers.onChallengeRequest);
    socket.on('challengeRejected', challengeSocketHandlers.onChallengeRejected);
}

export {registerChallengeHandlers, challengeSocketHandlers, emittedEvents};
