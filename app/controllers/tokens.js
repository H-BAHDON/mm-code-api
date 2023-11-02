const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

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
    const decoded = jwt.verify(token, secretKey); 
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
