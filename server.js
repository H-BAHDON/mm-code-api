const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const cookieSession = require("cookie-session");
require('./Auth/auth.js'); 
require('dotenv').config();

const cookieParser = require('cookie-parser');

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
// app.use(session({ secret: 'mm-code', resave: false, saveUninitialized: true }));

app.use(
	cookieSession({
		name: "session",
		keys: ["genny"],
		maxAge: 24 * 60 * 60 * 100, 
	})
);
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());



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
app.get('/platform', (req, res) => {
    req.session.randomValue = Math.random();
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
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.clearCookie('connect.sid');
    res.redirect(`${process.env.Client_SIDE_BASE_URL}/login`);
  });
});


app.get('/check-session', (req, res) => {
  try {

    if (req.isAuthenticated()) {
      res.sendStatus(200); 
    } else {
      res.sendStatus(401); 
    }

  } catch (e) {
    return res.status(500).json({ msg: "Error found" })
  } 
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}




// -----------------------------------------

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("GitHub authentication successful:", req.user);
    res.redirect(`${process.env.Client_SIDE_BASE_URL}/platform`);
  });


  app.get('/github/user'), (res, req) => {
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
  }


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



// --------------------------------------------------