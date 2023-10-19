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


router.get('/user', (req, res) => {
    const token = generateToken(req.user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none', 
    });
    res.json({ message: 'User authenticated', token }); 
  });


  // router.get('/protected', isLoggedIn, authController.protected);

router.get('/check-session', authController.checkSession)
router.get('/logout', authController.logout);

module.exports = router;
