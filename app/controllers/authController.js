
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






function logout(req, res) {
  res.clearCookie('token');
  req.logout();
  res.status(200).json({ success : true });
}

module.exports = {
  homePage,
  platform,
  logout,
};
