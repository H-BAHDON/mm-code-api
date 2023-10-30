const db = require('../../config/db/db');
const { verifyToken, generateToken } = require('../controllers/tokens'); 

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
    const { displayName, email } = req.user;
    const token = generateToken({ displayName, email }); 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: 'none',
    });

    res.json({ message: 'User authenticated', token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function handleScore(req, res) {
  try {
  } catch (error) {
    console.error('Error handling score:', error);
    res.status(500).json({ error: 'Error handling score' });
  }
}

async function saveScore(req, res) {
  try {
    const { score } = req.body;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userEmail = req.user.email;

    if (!isNaN(score)) {
      const query = 'UPDATE users SET total_score = total_score + $1 WHERE email = $2';
      await db.query(query, [score, userEmail]);
      console.log('Score saved successfully');
      res.json({ message: 'Score saved successfully' });
    } else {
      console.log('Invalid score value');
      res.status(400).json({ error: 'Invalid score value' });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Error saving score' });
  }
}


function getUser(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user);

    const userData = {
      displayName: req.user.displayName || req.user.username || req.user.fullName,
      email: req.user.email,
    };

    req.session.userData = userData;
    res.json({ message: 'User authenticated', userData });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}



function checkSession(req, res) {
  const token = req.cookies.session; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ message: 'User is authenticated' });
}


function logout(req, res) {
  req.logout();
  res.status(200).json({ success : true });
}

module.exports = {
  homePage,
  platform,
  getUser,
  checkSession,
  logout,
  handleScore,
  saveScore,
  login
};
