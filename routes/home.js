const router = require('express').Router();
const cheerio = require('cheerio');
const fs = require('fs')
const path = require('path')


const home = (req, res) => {
    const $ = cheerio.load(fs.readFileSync(path.resolve(__dirname, '../html/homepage.html'), {encoding : 'utf-8'}));


    if (req.session.username) {

        const profileButton = `<div onclick="window.location = '/profile?u=${req.session.username}'" id="profile", data-cy="profile">${req.session.username}</div>`;
        const logoutButton = `<div onclick="window.location = '/logout''" id="logout", data-cy="logout">Log out</div>`
        $('#navbar').append(profileButton);
        $('#navbar').append(logoutButton);

    } else {
        const signinButton = `<div onclick="window.location = '/login'" id="signin", data-cy="signin">Sign In</div>`;
        $('#navbar').append(signinButton);
    }

    res.status(200).send($.root().html());
}

router.route('/').get(home);

module.exports = router;