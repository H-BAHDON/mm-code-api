const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../config/db/db'); // Import your database configuration



const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.REACT_APP_API_URL}/auth/github/callback`,
  scope: ['user:email'],
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const githubId = profile.id.toString(); // Convert to string
    const displayName = profile.displayName;
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    const accountProvider = "GitHub"; // Specify the account provider

    const query = `
      INSERT INTO users (full_name, email, accounts, daily_score, total_score, total_time, daily_time, mm_completed)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE
      SET full_name = EXCLUDED.full_name, accounts = $3
      RETURNING *;`;

    const result = await db.query(query, [
      displayName,
      email,
      accountProvider,
      0,
      0,
      0,
      0,
      false,
    ]);

    const savedUser = result.rows[0];

    done(null, savedUser);
  } catch (error) {
    done(error);
  }
});



module.exports = githubStrategy;
