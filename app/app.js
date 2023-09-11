const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('../app/routes/authRoutes');
const githubRoutes = require('../app/routes/githubRoutes');
const googleRoutes = require('../app/routes/googleRoute'); // Replace with the correct path to your Google OAuth route file


const GoogleStrategy = require('../Auth/googleStrategy'); 
const GithubStrategy = require('../Auth/githubStrategy'); 
passport.use(GoogleStrategy);

passport.use(GithubStrategy);

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://www.mmcode.io',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  cookieSession({
    name: 'session',
    keys: ['genny'],
    maxAge: 24 * 60 * 60 * 100,
    sameSite: 'none',
    secure: true,
  })
);
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  // Serialize the user to the session
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize the user from the session
  done(null, user);
});


app.use('/', authRoutes);
app.use('/', githubRoutes);
app.use('/', googleRoutes); 
module.exports = app; 
