const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/matches')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/new', ensureLoggedIn, matchCtrl.createMatch)

module.exports = router