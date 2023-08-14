const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "617409105699-u5senri6ujm3b655n5gkb0g6f7r8r5j1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/google/callback", 
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  // This function is executed when a user is authenticated with Google
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
