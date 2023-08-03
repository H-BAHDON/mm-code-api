const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
    connectionString: 'postgres://mfwpdlgp:NFVCIfUASIDgx4gnuEZBirN3o6k3wZGH@surus.db.elephantsql.com/mfwpdlgp',
    ssl: {
      rejectUnauthorized: false
    }
  });

// Test the connection to the database
pool.query('SELECT NOW()')
  .then(res => console.log('react exercise Database connected! Current time: ', res.rows[0].now))
  .catch(err => console.error('Database connection error: ', err.stack));

// Export the pool object for use in other modules
module.exports = pool;
