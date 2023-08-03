const bcrypt = require('bcrypt');
const db = require('../config/db/db');
const nodemailer = require('nodemailer');

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

      // Send a welcome email to the user
      const transporter = nodemailer.createTransport({
        service: 'YourEmailService', // E.g., Gmail, Outlook, etc.
        auth: {
          user: 'your-email@example.com', // Your email address used for sending the email
          pass: 'your-email-password', // Your email password or an app-specific password if enabled
        },
      });

      const mailOptions = {
        from: 'husseinbahdon1@gmail.com', // Your email address
        to: email, // User's email address from signup form
        subject: 'Welcome to our website!', // Subject of the email
        text: `Hello ${fullName},\n\nThank you for signing up on our website. We are excited to have you with us!\n\nBest regards,\nYour Website Team`, // Plain text body
        // html: '<h1>Hello world!</h1>' // Use this if you want to send an HTML email
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          // Handle email sending error
        } else {
          console.log('Email sent:', info.response);
          // Email sent successfully
        }
      });

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
