const passport = require('passport');
const GoogleStrategy = require('./googleStrategy'); 
const githubStrategy = require('./githubStrategy'); 

passport.use('google', GoogleStrategy);
passport.use('github', githubStrategy);



passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
module.exports = passport;
