const db = require('../../config/db/db');
const { verifyToken, generateToken } = require('../controllers/tokens'); 
const jwt = require('jsonwebtoken');
const secretKey = 'melly';
function platform(req, res) {
  req.session.randomValue = Math.random();
  const storedRandomValue = req.session.randomValue;
  console.log(`Stored random value: ${storedRandomValue}`);
  console.log(`Logged in user: ${req.user.displayName}`);
  res.send('Welcome to the platform');
}

function homePage(req, res) {
  res.send("Home page running well.")

}

async function login(req, res) {
  try {
    // Authenticate the user, validate credentials, etc.
    const { username, password } = req.body;

    // Check user credentials (this is just an example, replace it with your authentication logic)
    if (username === 'user' && password === 'password') {
      // Generate a JSON web token (JWT) for the authenticated user
      const token = jwt.sign({ username }, secretKey, { expiresIn: '24h' });

      // Send the token to the client
      res.json({ message: 'User authenticated', token });
    } else {
      // If authentication fails, send an error response
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    // Handle errors, log them, and send an error response
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



function getUser(req, res) {
  console.log('Session:', req.session); // Log session information
  console.log('Authenticated:', req.isAuthenticated()); // Log if the user is authenticated
  console.log('User:', req.user); // Log the user object from the request

  if (req.isAuthenticated()) {
    console.log('Authenticated User:', req.user); 
    const userData = { 
      displayName: req.user.displayName || req.user.username || req.user.fullName,
      email: req.user.email,
    };
    res.json({ message: 'User authenticated', userData });
  } else {
    console.error('Authentication Error:', req.user); 
    res.status(401).json({ error: 'Not authenticated' });
  }
}




// function checkSession(req, res) {
//   const token = req.cookies.session; 

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const decodedToken = verifyToken(token);

//   if (!decodedToken) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   return res.status(200).json({ message: 'User is authenticated' });
// }


function logout(req, res) {
  res.clearCookie('token');
  req.logout();
  res.status(200).json({ success : true });
}

module.exports = {
  homePage,
  platform,
  getUser,
  logout,
  login
};
