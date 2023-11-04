const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

router.get('/', authController.homePage);

router.get('/platform', authController.platform);

router.get('/user', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey );
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

router.get('/checkSession', (req, res) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decodedToken = jwt.verify(token, secretKey );

  if (!decodedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ message: 'User is authenticated' });
})

router.get('/logout', authController.logout);

module.exports = router;


