// path-to-your-db-connection-file

const mysql = require('mysql2');

function createPoolWithRetry(config, maxRetries = 10) {
  function attemptConnection(retries) {
    const pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10, // Adjust according to your needs
      queueLimit: 0,
    });

    pool.getConnection((err, connection) => {
      if (!err) {
        console.log('Database pool is connected!');
        connection.release(); // Release the connection back to the pool
      } else {
        console.log('Error connecting to the database pool!', err);
        if (retries > 0) {
          console.log(`Retrying connection (${maxRetries - retries + 1}/${maxRetries})`);
          setTimeout(() => attemptConnection(retries - 1), 5000); // wait 5 seconds before retrying
        } else {
          console.log('Failed to connect to the database pool after retries.');
        }
      }
    });

    return pool;
  }

  return attemptConnection(maxRetries);
}

const config = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const config_local = {
  host: "localhost",
  port: "3307",
  user: "root",
  password: "root",
  database: "growthcalculator",
};

const db = createPoolWithRetry(config);

module.exports = db;
