const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const db = require('../config/db/db')

const GOOGLE_CLIENT_ID = "617409105699-u5senri6ujm3b655n5gkb0g6f7r8r5j1.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/google/callback", 
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {

  const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
  const emailValue = [profile.emails[0].value];

  db.query(checkEmailQuery, emailValue, (err, result) => {
    if (err) {
      return done(err);
    }

    if (result.rows.length === 0) {
      const insertUserQuery = 'INSERT INTO users (full_name, email) VALUES ($1, $2)';
      const insertUserValues = [profile.displayName, profile.emails[0].value];

      db.query(insertUserQuery, insertUserValues, (err) => {
        if (err) {
          return done(err);
        }

        const user = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
        };
        return done(null, user);
      });
    } else {
      const user = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };
      return done(null, user);
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
