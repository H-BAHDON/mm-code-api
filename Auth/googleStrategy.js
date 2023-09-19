const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db/db'); // Import your database configuration

export function updateUserScore(email, score) {
  const updateScoreQuery = 'UPDATE users SET total_score = $1 WHERE email = $2';
  const updateScoreValues = [score, email];

  return db.query(updateScoreQuery, updateScoreValues);
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.REACT_APP_API_URL}/auth/google/callback`,
    passReqToCallback: true,
  },
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const emailValue = [profile.emails[0].value];

      const userResult = await db.query(checkEmailQuery, emailValue);

      if (userResult.rows.length === 0) {
        const insertUserQuery =
          'INSERT INTO users (full_name, email, accounts) VALUES ($1, $2, $3)';
        const insertUserValues = [
          profile.displayName,
          profile.emails[0].value,
          'Google',
        ]; // Set the account provider to 'Google'

        await db.query(insertUserQuery, insertUserValues);

        const user = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          accountProvider: 'Google',
        };

        // Check if the client has provided a score in the request
        if (request.body && !isNaN(request.body.score)) {
          const score = parseInt(request.body.score);
          updateUserScore(user.email, score);
        }

        return done(null, user);
      } else {
        const user = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          accountProvider: 'Google',
        };

        // Check if the client has provided a score in the request
        if (request.body && !isNaN(request.body.score)) {
          const score = parseInt(request.body.score);
          updateUserScore(user.email, score);
        }

        return done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  }
);


module.exports = googleStrategy;
