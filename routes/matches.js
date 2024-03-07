const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/matches')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/', ensureLoggedIn, matchCtrl.createMatch)

router.get('/new', ensureLoggedIn, matchCtrl.fetchMatches)
router.get('/:id', ensureLoggedIn, matchCtrl.showMatch)


router.put('/:id/reject/:matchId', ensureLoggedIn, matchCtrl.rejectMatch)

router.put('/:id/accept/:matchId', ensureLoggedIn, matchCtrl.acceptMatch)

router.delete('/:id', ensureLoggedIn, matchCtrl.delete)

module.exports = router