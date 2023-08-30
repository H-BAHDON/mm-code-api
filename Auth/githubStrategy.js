const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../config/db/db'); // Import your database configuration

const GITHUB_CLIENT_ID = "613427a2df3476638f43";
const GITHUB_CLIENT_SECRET = "417c54c316a47b3ead02087f71bce99b75c856bf";

const githubStrategy = new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.REACT_APP_API_URL}/auth/github/callback`,
    scope: ['user:email'],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const githubId = profile.id.toString(); // Convert to string
      const username = profile.username;
      const email = profile.email;
      const accountProvider = "GitHub"; // Specify the account provider

      // Create the SQL query for inserting or updating the user
      const query = `
        INSERT INTO users (full_name, email, accounts, daily_score, total_score, total_time, daily_time, mm_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name, accounts = $3
        RETURNING *;`;

      // Execute the query with parameters
      const result = await db.query(query, [
        username,
        email,
        accountProvider,
        0, // Initial values
        0,
        0,
        0,
        false,
      ]);

      // Get the saved or updated user from the query result
      const savedUser = result.rows[0];

      // Call the 'done' callback with the user object or any other necessary data.
      done(null, savedUser);
    } catch (error) {
      // Handle errors and call 'done' with the error if needed.
      done(error);
    }
  }
);

module.exports = githubStrategy;
