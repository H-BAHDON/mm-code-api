const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db/db'); // Import your database configuration
const passport = require('passport');

const GOOGLE_CLIENT_SECRET="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"
const GOOGLE_CLIENT_ID="617409105699-u5senri6ujm3b655n5gkb0g6f7r8r5j1.apps.googleusercontent.com"


const googleStrategy = new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3001/auth/google/callback`,
  passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {

  const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
  const emailValue = [profile.emails[0].value];

  db.query(checkEmailQuery, emailValue, (err, result) => {
    if (err) {
      return done(err);
    }

    if (result.rows.length === 0) {
      const insertUserQuery = 'INSERT INTO users (full_name, email, accounts) VALUES ($1, $2, $3)';
      const insertUserValues = [profile.displayName, profile.emails[0].value, 'Google']; 

      db.query(insertUserQuery, insertUserValues, (err) => {
        if (err) {
          return done(err);
        }

        const user = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          accountProvider: 'Google', 
        };
        return done(null, user);
      });
    } else {
      const user = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        accountProvider: 'Google', 
      };
      return done(null, user);
    }
  });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  // Query your database using the provided user ID
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = googleStrategy;
