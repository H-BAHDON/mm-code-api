function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  }
  
  export default { isLoggedIn };