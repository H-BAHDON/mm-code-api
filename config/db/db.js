const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
    connectionString: 'postgres://hzxxyodc:lx9EgngCHzM-uAX0GnOpdwrZXX4vsSe5@surus.db.elephantsql.com/hzxxyodc',
    ssl: {
      rejectUnauthorized: false
    }
  });

// Test the connection to the database
pool.query('SELECT NOW()')
  .then(res => console.log('Database for users connected! Current time: ', res.rows[0].now))
  .catch(err => console.error('Database connection error: ', err.stack));

// Export the pool object for use in other modules
module.exports = pool;
