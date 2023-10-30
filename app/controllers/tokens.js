const jwt = require('jsonwebtoken');

const secretKey = 'melly'; 

function generateToken(user) {
  const token = jwt.sign({ user }, secretKey, { expiresIn: '24h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
