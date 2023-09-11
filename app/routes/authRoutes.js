const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { isLoggedIn } = require('../middleware/authenticationMiddleware');


router.get('/platform', authController.platform);
router.get('/user', authController.getUser);
// router.get('/protected', isLoggedIn, authController.protected);
router.get('/check-session', authController.checkSession)
router.get('/logout', authController.logout);

module.exports = router;
