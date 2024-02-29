const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');
const uploadImage = require('../../src/utilities/uploadImage');
const User = require('../../models/user');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// PUT route to update user profile image
router.put("/:userId/profile-image", uploadImage.single("image"), ensureLoggedIn, usersCtrl.uploadImage)


// All paths start with '/api/users'
// GET /api/users/check-token
router.get('/check-token', usersCtrl.checkToken);

router.get('/', usersCtrl.showAccounts)
// POST /api/users (create a user - sign up)
router.post('/', usersCtrl.create);
// POST /api/users/login
router.post('/login', usersCtrl.login);

module.exports = router;