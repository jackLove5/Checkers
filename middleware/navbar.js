const cheerio = require('cheerio');
const addMenuItems = (req, res, next) => {
    const oldSend = res.send;
    res.send = function(html) {
        const $ = cheerio.load(html);
        const homeItem = `<li><a href="/" data-cy="home">Home</a></li>`;
        const leaderboardItem = `<li><a href="/leaderboard" data-cy="leaderboard">Leaderboard</a></li>`

        $('#nav-list').append(homeItem);
        $('#nav-list').append(leaderboardItem);
        if (req.session.username) {

            const profileItem = `<li><a href="/profile?u=${req.session.username}" id="profile" data-cy="profile">${req.session.username}</a></li>`;
            const logoutItem = `<li><a href="/api/user/logout" id="logout" data-cy="logout">Log out</a></li>`;
            $('#nav-list').append(profileItem);
            $('#nav-list').append(logoutItem);
        
        } else {
            const signinItem = `<li><a href="/login" id="signin" data-cy="signin">Sign In</a></li>`;
            $('#nav-list').append(signinItem);
        }

        res.send = oldSend;
        return res.send($.root().html());
    }

    next();
}

module.exports = {addMenuItems};

