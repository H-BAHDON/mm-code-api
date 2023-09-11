const passport = require("passport");

// Google OAuth authentication
function googleAuth(req, res) {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
}

// Callback after Google OAuth authentication
function googleCallback(req, res, next) {
  passport.authenticate('google', {
    successRedirect: `${process.env.Client_SIDE_BASE_URL}/platform`,
    failureRedirect: '/auth/google/failure'
  })(req, res, next);
}

// Failure route
function googleFailure(req, res) {
  res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
  // Note: You should not use `res.send` after `res.redirect` as it will not be executed.
}

module.exports = {
  googleAuth,
  googleCallback,
  googleFailure
};
