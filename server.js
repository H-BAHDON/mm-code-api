const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Updated port to 3000
const session = require('express-session');
const passport = require('passport');

require('./Auth/auth.js'); 
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(session({ secret: 'mm-code', resave: false, saveUninitialized: true }));

app.use(express.json());
app.set('trust proxy', 1); // Add this line to trust first proxy

app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a> ');
  
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.Client_SIDE_BASE_URL}/platform`,
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/auth/google/failure', isLoggedIn, (req, res) => {
  res.send(`something went wrong`);
});

app.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/auth/google/failure');
    }
    req.session.user = {
      displayName: user.displayName,
      email: user.email,
    };
    res.redirect(`${process.env.Client_SIDE_BASE_URL}/platform`);
  })(req, res, next);
});

app.get('/platform', (req, res) => {
 
    req.session.randomValue = Math.random();

    // Access stored random value
    const storedRandomValue = req.session.randomValue;
    console.log(`Stored random value: ${storedRandomValue}`);

    console.log(`Logged in user: ${req.user.displayName}`);
    res.send('Welcome to the platform');
 
});

app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    const userData = {
      displayName: req.user.displayName,
      email: req.user.email,
    };
    req.session.userData = userData;

    res.json(userData);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});


app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`
    <p>Hello ${req.user.displayName}</p>
    <form action="/logout" method="post">
    <button type="submit">Logout</button>
  </form>
  
  `);
});
app.get('/logout', (req, res) => {
  // Clear the session by logging the user out
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      // Handle the error if needed
    }

    // Clear the authentication cookie (connect.sid)
    res.clearCookie('connect.sid');

    // Redirect to the home page or another appropriate page
    res.redirect('/');
  });
});
// Server-side code
app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200); // Session cookie exists
  } else {
    res.sendStatus(401); // Session cookie does not exist
  }
});

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

// Listen on port 3000
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

