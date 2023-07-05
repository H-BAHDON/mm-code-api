const bcrypt = require('bcrypt');
const db = require('../config/db/db');

function signup(app) {
  app.post('/signup', async (req, res) => {
    const { username, email, password, fullName } = req.body;

    try {
      // Check if the username or email already exists in the database
      const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
      const values = [username, email];
      const result = await db.query(query, values);

      if (result.rows.length > 0) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database with the score
      const insertQuery = 'INSERT INTO users (full_name, username, email, password, score) VALUES ($1, $2, $3, $4, $5)';
      const insertValues = [fullName, username, email, hashedPassword, 0]; // Set the initial score to 0
      await db.query(insertQuery, insertValues);

      // Create a session for the user
      req.session.user = {
        username,
        email,
        fullName,
        score: 0
      };

      // Respond with a success message
      res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

module.exports = signup;
