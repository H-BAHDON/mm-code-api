const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

router.get('/', authController.homePage);

router.get('/platform', authController.platform);
router.post('/login', authController.login);

router.get('/user', (req, res) => {
  // Access the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey );

    // User is authenticated, you can access user data from decoded payload
    const userData = {
      displayName: decoded.displayName || decoded.username || decoded.fullName,
      email: decoded.email,
    };

    res.json({ message: 'User authenticated', userData });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

router.get('/logout', authController.logout);

module.exports = router;
