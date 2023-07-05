
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const login = require("./Routes/login.js");
const signUp = require("./Routes/signup.js");
const apiUrl = process.env.REACT_APP_API_URL;


app.set("view engine", "ejs");
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(session({
  key: "userID",
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24,
    sameSite: 'none',
    secure: true
  },
}));


// Route for testing server status

login(app);
signUp(app);

// Check if the user session exists and redirect to /platform if logged in
app.get('/login', (req, res) => {
  if (req.session.user) {
    console.log('Logged in user:', req.session.user.username);
    return res.redirect('/platform');
  }

  // Render the login page
  // ...
});

// Check if the user session exists and redirect to /platform if logged in
app.get('/signup', (req, res) => {
  if (req.session.user) {
    console.log('Logged in user:', req.session.user.username);
    return res.redirect('/platform');
  }

  // Render the signup page
  // ...
});

app.get('/platform', (req, res) => {
  if (req.session.user) {
    console.log('Logged in user:', req.session.user.username);
    // Render the platform page
    // ...
  } else {
    // User is not logged in, redirect to the login page
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
