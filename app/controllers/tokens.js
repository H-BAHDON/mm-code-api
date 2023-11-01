const jwt = require('jsonwebtoken');

const secretKey = 'melly'; 

function generateToken(user) {
  const token = jwt.sign({ user }, secretKey, { expiresIn: '24h' });
  return token;
}

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Replace 'your-secret-key' with your actual secret key used for signing the token
    req.user = decoded; // The decoded payload is available in req.user
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
