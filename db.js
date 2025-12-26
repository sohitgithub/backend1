const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '0.0.0.0',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', 
  database: process.env.DB_NAME || 'symbiotec_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise-based wrapper export karein
const db = pool.promise();

// Connection Test (Optional but good for debugging)
pool.getConnection((err, connection) => {
    if (err) console.error(">>> ❌ Database Connection Failed:", err.message);
    else {
        console.log(">>> ✅ Connected to Database");
        connection.release();
    }
});

module.exports = db;