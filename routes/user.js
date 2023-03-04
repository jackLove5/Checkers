const express = require('express')
const router = express.Router()

const {createUser, authenticateUser, getRankings, getUserByUsername} = require('../controller/user')

router.route('/register').post(createUser);
router.route('/login').post(authenticateUser);
router.route('/rankings').get(getRankings);
router.route('/:username').get(getUserByUsername);

module.exports = router;