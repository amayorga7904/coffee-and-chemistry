const express = require('express')
const router = express.Router()

const messageCtrl = require('../controllers/messages')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.post('/:id', ensureLoggedIn, messageCtrl.create)

module.exports = router