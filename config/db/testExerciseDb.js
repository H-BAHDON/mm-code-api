const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
    connectionString: 'postgres://spridvku:uLGAAQhwtjgRBGGnKjUd34YePaVfVP6R@surus.db.elephantsql.com/spridvku',
    ssl: {
      rejectUnauthorized: false
    }
  });

// Test the connection to the database
pool.query('SELECT NOW()')
  .then(res => console.log('Testing exercise Database connected! Current time: ', res.rows[0].now))
  .catch(err => console.error('Database connection error: ', err.stack));

// Export the pool object for use in other modules
module.exports = pool;
