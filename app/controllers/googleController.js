const passport = require("passport");
const jwt = require('jsonwebtoken');

function googleAuth(req, res) {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res);
}

function googleCallback(req, res, next) {
  passport.authenticate('google', {
    successRedirect: `${process.env.Client_SIDE_BASE_URL}/platform`,
    failureRedirect: '/auth/google/failure'
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Handle authentication failure
      return res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
    }

    // Generate a JWT token
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours expiration
      sameSite: 'none',
    });

    // Redirect to the desired page after successful login
    return res.redirect(`${process.env.Client_SIDE_BASE_URL}/platform`);
  })(req, res, next);
}

function googleFailure(req, res) {
  res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
}

module.exports = {
  googleAuth,
  googleCallback,
  googleFailure
};
