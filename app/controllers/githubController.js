const passport = require('passport');

function githubAuth(req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
}


function githubCallback(req, res, next){
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, function() {
      console.log("GitHub authentication successful:", req.user);
      res.redirect(`http://localhost:3001/platform`);
    });
  }


function githubSuccess(req, res) {
    console.log("GitHub authentication successful:", req.user);
    res.redirect(`http://localhost:3001/platform`);
}

function getGitHubUser(req, res) {
    if (req.isAuthenticated()) {
        const userData = {
            displayName: req.user.displayName,
            email: req.user.email
        };
        req.session.userData = userData;
        res.json(userData);
    } else {
        res.status(401).json({error: 'Not authenticated'});
    }
}

module.exports = {
    githubAuth,
    githubCallback,
    githubSuccess,
    getGitHubUser
};
