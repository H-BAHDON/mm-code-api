const bcrypt = require('bcrypt');
const db = require('../config/db/db');
const cors = require('cors');

function login(app) {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username in the database
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await db.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result.rows[0];
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      // Set the user's full name in the session
      req.session.user = {
        username: user.username,
        fullName: user.full_name
      };
  
      // Log a message to the console
      console.log(`User ${username} is logged in`);
  
      // Send a JSON response indicating successful login with username and full name
      res.json({ message: 'Login successful', username: user.username, fullName: user.full_name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Remove the GET /login route, assuming it is not needed anymore
}

module.exports = login;
