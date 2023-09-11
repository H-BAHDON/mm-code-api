// authRoutes.js

function platform(req, res) {
  req.session.randomValue = Math.random();
  const storedRandomValue = req.session.randomValue;
  console.log(`Stored random value: ${storedRandomValue}`);
  console.log(`Logged in user: ${req.user.displayName}`);
  res.send('Welcome to the platform');
}

function getUser(req, res) {
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
  if (req.isAuthenticated()) {
      return next();
  }
  res.sendStatus(401);
}

module.exports = {
  platform,
  getUser,
  checkSession,
  logout,
};
