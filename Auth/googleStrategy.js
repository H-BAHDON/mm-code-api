const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db/db'); // Import your database configuration

// const GOOGLE_CLIENT_ID = "617409105699-u5senri6ujm3b655n5gkb0g6f7r8r5j1.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const googleStrategy = new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: `https://mm-code-api-b4f2aff44087.herokuapp.com/auth/google/callback`,
  passReqToCallback: true,
},function(request, accessToken, refreshToken, profile, done) {
    // This function is executed when a user is authenticated with Google
  
    // Check if the user's email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
    const emailValue = [profile.emails[0].value];
  
    db.query(checkEmailQuery, emailValue, (err, result) => {
      if (err) {
        return done(err);
      }
  
      if (result.rows.length === 0) {
        // Email does not exist, insert the user's display name and email
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
        // Email already exists, handle accordingly (e.g., proceed with user info)
        const user = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
        };
        return done(null, user);
      }
    });
  });

module.exports = googleStrategy;
