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
});