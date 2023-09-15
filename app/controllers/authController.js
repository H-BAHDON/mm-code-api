const db = require('../../config/db/db');
function platform(req, res) {
  req.session.randomValue = Math.random();
  const storedRandomValue = req.session.randomValue;
  console.log(`Stored random value: ${storedRandomValue}`);
  console.log(`Logged in user: ${req.user.displayName}`);
  res.send('Welcome to the platform');
}

function homePage(req, res) {
  res.send("Home page running well.")
// query db
  // handleScore(req, res);
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

    if (req.isAuthenticated()) {
      if (!isNaN(score)) {
        const userEmail = req.user.email; // Get the user's email
        const query = 'UPDATE users SET total_score = total_score + $1 WHERE email = $2'; // Update based on email
        console.log('SQL Query:', query);

        const result = await db.query(query, [score, userEmail]);

        if (result.rowCount === 1) {
          console.log('Score saved successfully');
          res.json({ message: 'Score saved successfully' });
        } else {
          console.log('No user found with the specified email');
          res.status(404).json({ error: 'User not found' });
        }
      } else {
        console.log('Invalid score value');
        res.status(400).json({ error: 'Invalid score value' });
      }
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Error saving score' });
  }
}






function getUser(req, res) {
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Assuming you have a unique identifier for users
    db.query('SELECT full_name, email FROM users WHERE id = $1', [userId])
      .then(result => {
        if (result.rows.length === 0) {
          // User not found in the database, use backup method
          const userData = {
            displayName: req.user.displayName || req.user.username, // Use username if displayName is not available
            email: req.user.email,
          };
          req.session.userData = userData;
          res.json(userData);
        } else {
          // User found in the database
          const userData = {
            displayName: result.rows[0].full_name,
            email: result.rows[0].email,
          };
          req.session.userData = userData;
          res.json(userData);
        }
      })
      .catch(error => {
        console.error('Error fetching user data from the database:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}



function checkSession(req, res) {
  try {
      if (req.isAuthenticated()) {
          res.sendStatus(200);
      } else {
          res.sendStatus(401);
      }
  } catch (e) {
      return res.status(500).json({ msg: "Error found" });
  }
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
};
