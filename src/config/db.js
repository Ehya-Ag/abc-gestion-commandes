
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'test_user',
  password: 'password123',
  database: 'abc_corporation',
  connectionLimit: 2,
  connectTimeout: false
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  connection.release();
});

module.exports = db;
