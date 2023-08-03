const { Pool } = require('pg');

// Create a new instance of the Pool class
const pool = new Pool({
    connectionString: 'postgres://mqyyxbrq:3mreQApj_gUi20kWxTl0o9QBanSm18jM@surus.db.elephantsql.com/mqyyxbrq',
    ssl: {
      rejectUnauthorized: false
    }
  });

// Test the connection to the database
pool.query('SELECT NOW()')
  .then(res => console.log('Html exercise Database connected! Current time: ', res.rows[0].now))
  .catch(err => console.error('Database connection error: ', err.stack));

// Export the pool object for use in other modules
module.exports = pool;
