
function platform(req, res) {
  req.session.randomValue = Math.random();
  const storedRandomValue = req.session.randomValue;
  console.log(`Stored random value: ${storedRandomValue}`);
  console.log(`Logged in user: ${req.user.displayName}`);
  res.send('Welcome to the platform');
}

function getUser(req, res) {
  if (req.isAuthenticated()) {
    let displayName = req.user.displayName; // Default to GitHub's display name
    if (req.user.accounts === 'Google') {
      // For Google authentication, use the display name directly from the profile
      displayName = req.user.displayName;
    }
    
    const userData = {
      displayName: displayName,
      email: req.user.email,
    };

    req.session.userData = userData;
    res.json(userData);
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
