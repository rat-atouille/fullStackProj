const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DATABASE_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL server as id', db.threadId);
});

module.exports = db;