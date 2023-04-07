const express = require('express')
const router = express.Router()

const {createUser, authenticateUser, getUserByUsername, logout} = require('../../controller/user')

router.route('/register').post(createUser);
router.route('/login').post(authenticateUser);
router.route('/logout').get(logout);
router.route('/:username').get(getUserByUsername);

module.exports = router;