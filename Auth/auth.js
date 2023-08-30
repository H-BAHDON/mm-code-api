const passport = require('passport');
const GoogleStrategy = require('./googleStrategy'); // Import the exported Google strategy
const githubStrategy = require('./githubStrategy'); // Import the exported GitHub strategy

// Use the Google and GitHub strategies with their respective names
passport.use('google', GoogleStrategy);
passport.use('github', githubStrategy);



passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
// Export the configured passport
module.exports = passport;
