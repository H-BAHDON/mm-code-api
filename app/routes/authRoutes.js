const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { generateToken } = require('../controllers/tokens'); 
const passport = require('passport');


router.get('/', authController.homePage)
router.get('/score', authController.handleScore)
router.post('/save-score', authController.saveScore);
router.get('/platform', authController.platform);
router.post('/login', authController.login);

router.get('/user', passport.authenticate(), authController.getUser);

router.get('/check-session', authController.checkSession)
router.get('/logout', authController.logout);

module.exports = router;
