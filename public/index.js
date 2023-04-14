
const CheckersBoard = require('./CheckersBoard');
import { registerChallengeHandlers, challengeSocketHandlers, emittedEvents } from './challenge';
let socket = io.connect("/", {
    withCredentials: true
});


registerChallengeHandlers(socket);

if (window.Cypress) {
    window.socketHandlers = challengeSocketHandlers;
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
        window.location = `/play/game/${json._id}`;
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
        window.location = `/play/game/${json._id}`;
    }

    document.getElementById('checkers-board').lockBoard();
});