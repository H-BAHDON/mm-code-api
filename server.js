require('dotenv').config(); // Import environment variables from .env file
const app = require('./app/app'); // Import your Express app from the app.js file
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
