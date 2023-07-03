const express = require('express');
const app = express();
const port = 5000; // Choose your desired port

// Set up routes
app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});