const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile')
const ensureLoggedIn = require('../config/ensureLoggedIn');


router.put('/:userId', ensureLoggedIn, profileCtrl.editBio)

module.exports = router