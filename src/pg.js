const { Pool, types } = require('pg');

const pool = new Pool({
    user: 'ashwath',
    host: 'localhost',
    database: 'postgres',
    port: '5432',
    max: 5,
    idleTimeoutMillis: 100000,
    // connectionTimeoutMillis: config.get('CONNECTIONTIMEOUT'),
    // application_name: 'retail_backend',
});
  
pool.on('error', (err) => {
    logger.error(`Postgres connection error on client - ${err.message}`);
    throw err;
});

pool.on('connect', () => {
    console.log('DB connection success');
});

function query(text, params) {
    return pool.query(text, params);
}
  
/** Use this for transactional integrity */
function getClient() {
  return pool.connect();
}

module.exports = {
    query,
    getClient
}