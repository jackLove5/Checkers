let socket = io.connect("/", {
    withCredentials: true
});

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
        console.log('emitting createChallenge')
        socket.emit('createChallenge', {receiverName: document.getElementById('username').textContent, isRanked: false, color: 'b'});
        socket.on('challengeStart', ({gameId}) => {
            console.log('challengeStart received')
            window.location = `/play/${gameId}`;
        })
    })
})