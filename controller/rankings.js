const User = require('../models/user')

const getRankings = async (req, res) => {

    let users;

    try {
        users = await User.find({}).sort({'rating' : 'desc'});
    } catch (err) {
        console.log(`${new Date().toLocaleString()} ${err}`);
        res.status(500).send('');
        return;
    }

    users = users.map(user => {
        const {username, rating} = user;
        return {username, rating};
    });
    
    res.status(200).json({users});
}

module.exports = {getRankings};