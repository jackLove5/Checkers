window.addEventListener('load', (e) => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({username, password})
        });

        if (res.status === 200) {
            window.location = `/`
        } else {
            alert('error');
        }
    })
})