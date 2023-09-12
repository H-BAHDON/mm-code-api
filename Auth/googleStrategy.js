const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db/db'); // Import your database configuration

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://mm-code-api-b4f2aff44087.herokuapp.com/auth/google/callback`,
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
      const insertUserValues = [profile.displayName, profile.emails[0].value, 'Google']; // Set the account provider to 'Google'

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


module.exports = googleStrategy;
