const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

router.get('/auth/google', googleController.googleAuth);
router.get('/auth/google/callback', googleController.googleCallback);
router.get('/auth/google/failure', authenticationMiddleware.isLoggedIn, googleController.googleFailure);

module.exports = router;
