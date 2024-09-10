const db = require('./config/db');

// Verifications des id
function customerExists(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM customers WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error checking customer existence:', err);
        reject(err);
      } else if (results.length > 0) {
        resolve(true); 
      } else {
        resolve(false); 
      }
    });
  });
}

// Pour les lister
function getCustomers() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM customers';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving customers:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Pour l'ajout
function addCustomer(name, address, email, phone) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)';
    
    db.query(query, [name, address, email, phone], (err, result) => {
      if (err) {
        console.error('Erreur ajout:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Pour la mise à jour
function updateCustomer(id, name, address, email, phone) {
  return new Promise((resolve, reject) => {
    customerExists(id)
      .then(exists => {
        if (exists) {
          const query = 'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?';
          
          db.query(query, [name, address, email, phone, id], (err, result) => {
            if (err) {
              console.error('Error updating customer:', err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else {
          reject(new Error(`Le client à ID ${id} n'existe pas.`));
        }
      })
      .catch(err => reject(err));
  });
}

// Pour la suppression
function deleteCustomer(id) {
  return new Promise((resolve, reject) => {
    customerExists(id)
      .then(exists => {
        if (exists) {
          const query = 'DELETE FROM customers WHERE id = ?';
          
          db.query(query, [id], (err, result) => {
            if (err) {
              console.error('Erreur de suppression:', err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else {
          reject(new Error(`Le client à ID ${id} n'existe pas.`));
        }
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};
