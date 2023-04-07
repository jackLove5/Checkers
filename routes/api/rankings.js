const express = require('express')
const router = express.Router();
const {getRankings} = require('../../controller/rankings')

router.route('/').get(getRankings);

module.exports = router;