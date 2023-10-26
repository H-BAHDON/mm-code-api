const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { isLoggedIn } = require('../middleware/authenticationMiddleware');
const { generateToken } = require('../controllers/tokens'); // Import your generateToken function

router.get('/', authController.homePage)
router.get('/score', authController.handleScore)
router.post('/save-score', authController.saveScore);
router.get('/platform', authController.platform);
router.post('/login', authController.login);


router.get('/user', authController.getUser);


  // router.get('/protected', isLoggedIn, authController.protected);

router.get('/check-session', authController.checkSession)
router.get('/logout', authController.logout);

module.exports = router;
