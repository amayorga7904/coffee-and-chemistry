const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/matches')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/', ensureLoggedIn, matchCtrl.createMatch)

router.get('/:id', ensureLoggedIn, matchCtrl.showMatch)

router.put('/:id/:matchId', ensureLoggedIn, matchCtrl.rejectMatch)

module.exports = router