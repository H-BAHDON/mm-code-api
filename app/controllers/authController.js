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


function handleScore (req, res){
  res.send("score is created");

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
};
