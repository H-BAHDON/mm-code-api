const bcrypt = require('bcrypt');
const db = require('../config/db/db');
const cors = require('cors');
// const sgMail = require('@sendgrid/mail'); // Install @sendgrid/mail package

function login(app) {
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://www.mmcode.io'],
      credentials: true,
    })
  );

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

  app.post('/password-reset', async (req, res) => {
    const { email } = req.body;

    // Generate a password reset token (you can use a library like `crypto` for this)
    const resetToken = generateResetToken();

    try {
      // Store the reset token in the database along with the user's email
      await storeResetTokenInDatabase(email, resetToken);

      // Send the password reset email to the user
      await sendPasswordResetEmail(email, resetToken);

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

// Function to send the password reset email using SendGrid
// async function sendPasswordResetEmail(email, resetToken) {
//   sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); // Set your SendGrid API key here
//   const msg = {
//     to: email,
//     from: 'noreply@example.com', // Set your from email address here
//     subject: 'Password Reset Request',
//     text: `Click the link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
//     html: `<p>Click the link to reset your password:</p> <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>`,
//   };
//   await sgMail.send(msg);
// }


  // Remove the GET /login route, assuming it is not needed anymore


module.exports = login;
