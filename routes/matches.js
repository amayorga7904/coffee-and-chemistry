const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/matches')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/', ensureLoggedIn, matchCtrl.createMatch)

router.get('/:id', ensureLoggedIn, matchCtrl.showMatch)

router.put('/:id/reject/:matchId', ensureLoggedIn, matchCtrl.rejectMatch)

router.put('/:id/accept/:matchId', ensureLoggedIn, matchCtrl.acceptMatch)

module.exports = router