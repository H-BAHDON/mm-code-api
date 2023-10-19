const jwt = require('jsonwebtoken');

const secretKey = 'melly'; 

// Function to generate a JWT token
function generateToken(user) {
  const token = jwt.sign({ user }, secretKey, { expiresIn: '24h' });
  return token;
}

// Function to verify JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
