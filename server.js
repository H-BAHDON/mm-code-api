

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // Import morgan


require('dotenv').config();
require('./Auth/auth'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://www.mmcode.io'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(session({ secret: 'mm-code', resave: false, saveUninitialized: true }));


app.use(morgan('dev'));
app.use(
  session({
    secret: 'abcdef123456',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
      sameSite: 'none',
      secure: true,
    },
  })
);

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

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


app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }

    res.clearCookie('connect.sid');

    res.redirect('/');
  });
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

app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200); 
  } else {
    res.sendStatus(401); 
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


  app.get('/github/user', (req, res) => {
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
  


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



// --------------------------------------------------

