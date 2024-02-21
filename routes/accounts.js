const express = require('express');
const router = express.Router();
const accountsCtrl = require('../controllers/accounts')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/', ensureLoggedIn, accountsCtrl.create)

router.get('/public', ensureLoggedIn, accountsCtrl.showAccounts)

module.exports = router