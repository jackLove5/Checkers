let socket = io.connect("/", {
    withCredentials: true
});

window.addEventListener('load', (e) => {
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

    socket.on('challengeRequest', ({challenge}) => {
        const challengeText = `received challenge: ${JSON.stringify(challenge)}`;
        const accept = confirm(challengeText);
        socket.emit('respondToChallenge', {challengeId: challenge._id, accept})
    });

    socket.on('challengeStart', ({gameId}) => {
        window.location = `/play/${gameId}`;
    })
    socket.on('challengeRejected', () => alert('challengeRejected'));
});