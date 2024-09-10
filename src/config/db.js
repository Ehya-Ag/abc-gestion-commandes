
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'test_user',
  password: 'password123',
  database: 'abc_corporation'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = db;
