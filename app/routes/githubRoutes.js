const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/auth/github', githubController.githubAuth);
router.get('/auth/github/callback', githubController.githubCallback);
router.get('/github/user', githubController.getGitHubUser);

module.exports = router;
