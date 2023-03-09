const {createGame, getGamesByUsername, getGameById} = require('../controller/game')
const express = require('express')
const router = express.Router();

router.route('/create').post(createGame);
router.route('/').get(getGamesByUsername)
router.route('/:id').get(getGameById);

module.exports = router