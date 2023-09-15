const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { isLoggedIn } = require('../middleware/authenticationMiddleware');

router.get('/', authController.homePage)
router.get('/score', authController.handleScore)
router.post('/save-score', authController.saveScore);
router.get('/platform', authController.platform);
router.get('/user', authController.getUser);
// router.get('/protected', isLoggedIn, authController.protected);
router.get('/check-session', authController.checkSession)
router.get('/logout', authController.logout);

module.exports = router;
