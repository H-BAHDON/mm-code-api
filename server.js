const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const login = require('./Routes/login.js');
const signUp = require('./Routes/signup.js');
const cookieParser = require('cookie-parser');
const pgSession = require('connect-pg-simple')(session);
const db = require('./config/db/db.js');


const PORT = process.env.PORT || 3001;


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://www.mmcode.io'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  session({
    store: new pgSession({
      pool: db.pool, // Use your PostgreSQL pool from db.js (assuming you have it)
      tableName: 'session', // The table name for storing sessions
    }),
    secret: 'abcdef123456',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, // Session expiration time (in seconds)
      sameSite: 'none',
      secure: true,
    },
  })
);

// Route for testing server status
login(app);
signUp(app);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate user and check credentials
    const user = await User.findOne({ username }); // Assuming you have a User model/schema

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Set session data for the authenticated user
    req.session.user = {
      username: user.username,
      fullName: user.fullName,
      // Include any other relevant user data
    };

    // Set a cookie to remember the login
    res.cookie('rememberLogin', true, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
      httpOnly: false, // Allowing access from JavaScript
      secure: false, // Not enforcing HTTPS
      sameSite: 'None', // Allowing cross-site cookies
    });

    console.log('Login cookie set:', req.cookies.rememberLogin);

    res.json({ message: 'Login successful', username: user.username, fullName: user.fullName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
