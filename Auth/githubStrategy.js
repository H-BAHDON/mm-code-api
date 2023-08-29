const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../config/db/db'); // Import your database configuration

const GITHUB_CLIENT_ID = "613427a2df3476638f43";
const GITHUB_CLIENT_SECRET = "417c54c316a47b3ead02087f71bce99b75c856bf";

const githubStrategy = new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback",
    scope: [ 'user:email' ],
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const githubId = profile.id;
        const username = profile.username; 
        const email = profile.email;
        
        const user =  githubId + username + email;
        
        // Call the 'done' callback with the user object or any other necessary data.
        done(null, user);
    } catch (error) {
        // Handle errors and call 'done' with the error if needed.
        done(error);
    }
}
);

module.exports = githubStrategy;
