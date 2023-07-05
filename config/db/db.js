const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
    connectionString: 'postgres://mkppjffk:76JvecAHScIXtGBZOWUAZHINNAMUatGr@rogue.db.elephantsql.com/mkppjffk',
    ssl: {
      rejectUnauthorized: false
    }
  });

// Test the connection to the database
pool.query('SELECT NOW()')
  .then(res => console.log('Database connected! Current time: ', res.rows[0].now))
  .catch(err => console.error('Database connection error: ', err.stack));

// Export the pool object for use in other modules
module.exports = pool;
