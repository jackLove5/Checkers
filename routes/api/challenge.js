const express = require('express');
const router = express.Router();
const {createChallenge, respondToChallenge} = require('../../controller/challenge');

router.route('/create').post(createChallenge);
router.route('/respond').patch(respondToChallenge);

module.exports = router;

