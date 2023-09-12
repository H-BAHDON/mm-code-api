
function platform(req, res) {
  req.session.randomValue = Math.random();
  const storedRandomValue = req.session.randomValue;
  console.log(`Stored random value: ${storedRandomValue}`);
  console.log(`Logged in user: ${req.user.displayName}`);
  res.send('Welcome to the platform');
}

function getUser(req, res) {
  if (req.isAuthenticated()) {
    // Assuming you have a function to retrieve user data from the database
    const userId = req.user.id; // Assuming you have a unique identifier for users
    db.query('SELECT full_name, email FROM users WHERE id = $1', [userId])
      .then(result => {
        if (result.rows.length === 0) {
          res.status(404).json({ error: 'User not found in the database' });
        } else {
          const userData = {
            displayName: result.rows[0].full_name,
            email: result.rows[0].email,
          };
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
  platform,
  getUser,
  checkSession,
  logout,
};
