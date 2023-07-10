const isDevelopment = process.env.NODE_ENV === 'development';
const apiUrl = isDevelopment ? process.env.REACT_APP_API_URL : 'http://mmcode.io';

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const login = require('./Routes/login.js');
const signUp = require('./Routes/signup.js');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  session({
    key: 'userID',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
      sameSite: 'none',
      secure: true,
    },
  })
);

// Route for testing server status
login(app);
signUp(app);

app.post('/login', (req, res) => {
  // Authenticate user and set session data

  // Set a cookie to remember the login
  res.cookie('rememberLogin', true, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
    httpOnly: false, // Allowing access from JavaScript
    secure: false, // Not enforcing HTTPS
    sameSite: 'None', // Allowing cross-site cookies
  });
  console.log('Login cookie set:', req.cookies.rememberLogin);

  // Redirect or send response
  // ...
});

app.get('/signup', (req, res) => {
  if (req.session.user) {
    console.log('Logged in user:', req.session.user.username);
    return res.redirect('/platform');
  }

  // Process the signup form and create a new user

  // Set the session data for the newly signed up user
  const newUser = {
    username: 'newUser',
    fullName: 'New User',
    // Include any other relevant user data
  };
  req.session.user = newUser;

  // Redirect to the platform page or any other desired route
  res.redirect('/platform');
});
app.get('/platform', (req, res) => {
  if (req.session.user || hasRememberLoginCookie()) {
    console.log('Logged in user:', req.session.user.username);
   
    res.render('platform'); 
  } else {
    res.redirect('/login');
  }
});

app.get('/checklogin', (req, res) => {
  if (req.session.user) {
    const { username } = req.session.user;
    res.json({ loggedIn: true, username });
  } else {
    res.json({ loggedIn: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
