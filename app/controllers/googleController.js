const passport = require("passport");
const jwt = require('jsonwebtoken');
const secretKey = 'melly'; 
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
      return res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
    }

    const token = jwt.sign(user, secretKey, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: 'none',
    });

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
