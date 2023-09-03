const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isLoggedIn } = require('../middleware/authenticationMiddleware').default;


router.get('/auth/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/auth/google/failure', isLoggedIn, authController.googleFailure);


module.exports = router;