const db = require('./config/db');

//  tout les clients
function getCustomers() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM customers';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des clients:', err);
        reject(new Error("Une erreur est survenue lors de la récupération des clients. Veuillez réessayer."));
      } else {
        resolve(results);
      }
    });
  });
}

function isValidId(id) {
  return Number.isInteger(id) && id > 0;
}

function customerExists(id) {
  return new Promise((resolve, reject) => {
    // if (!isValidId(id)) {
    //   return reject(new Error("L'ID du client doit être un entier positif."));
    // }

    const query = 'SELECT * FROM customers WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'existence du client:', err);
        return reject(new Error("Erreur lors de la vérification de l'existence du client."));
      }
      resolve(results.length > 0);
    });
  });
}

// Fonction pour ajouter un client
function addCustomer(name, address, email, phone) {
  if (!isValidEmail(email)) {
    return Promise.reject(new Error("L'adresse email est invalide. Veuillez entrer une adresse email valide."));
  }
  if (phone && !isValidPhone(phone)) {
    return Promise.reject(new Error("Le numéro de téléphone est invalide. Veuillez entrer un numéro de téléphone valide avec entre 8 et 20 caractères."));
  }

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, email, phone], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'ajout du client:', err);
        return reject(new Error("Une erreur est survenue lors de l'ajout du client. Veuillez vérifier les données et réessayer."));
      }
      resolve(result);
    });
  });
}
function isValidId(id) {
  return Number.isInteger(parseInt(id));
}

// Vérifier si un client existe
function customerExists(id) {
  return new Promise((resolve, reject) => {
    const intId = parseInt(id, 10);

    if (!isValidId(intId)) {
      return reject(new Error("L'ID du client doit être un entier."));
    }

    const query = 'SELECT * FROM customers WHERE id = ?';
    db.query(query, [intId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'existence du client:', err);
        return reject(new Error("Erreur lors de la vérification de l'existence du client."));
      }
      resolve(results.length > 0);
    });
  });
}

// Fonction pour ajouter un client
function addCustomer(name, address, email, phone) {
  if (!isValidEmail(email)) {
    return Promise.reject(new Error("L'adresse email est invalide. Veuillez entrer une adresse email valide."));
  }
  if (phone && !isValidPhone(phone)) {
    return Promise.reject(new Error("Le numéro de téléphone est invalide. Veuillez entrer un numéro de téléphone valide avec entre 8 et 20 caractères."));
  }

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, email, phone], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'ajout du client:', err);
        return reject(new Error("Une erreur est survenue lors de l'ajout du client. Veuillez vérifier les données et réessayer."));
      }
      resolve(result);
    });
  });
}

// Fonction pour mettre à jour un client
function updateCustomer(id, name, address, email, phone) {
  const intId = parseInt(id, 10);

  if (!isValidId(intId)) {
    return Promise.reject(new Error("L'ID du client doit être un entier."));
  }
  if (!isValidEmail(email)) {
    return Promise.reject(new Error("L'adresse email est invalide. Veuillez entrer une adresse email valide."));
  }
  if (phone && !isValidPhone(phone)) {
    return Promise.reject(new Error("Le numéro de téléphone est invalide. Veuillez entrer un numéro de téléphone valide avec entre 8 et 20 caractères."));
  }

  return customerExists(intId)
    .then(exists => {
      if (!exists) {
        return Promise.reject(new Error(`Le client avec l'ID ${intId} n'existe pas.`));
      }

      const query = 'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?';
      return new Promise((resolve, reject) => {
        db.query(query, [name, address, email, phone, intId], (err, result) => {
          if (err) {
            console.error('Erreur lors de la mise à jour du client:', err);
            return reject(new Error("Une erreur est survenue lors de la mise à jour du client. Veuillez réessayer."));
          }
          resolve(result);
        });
      });
    });
}

function deleteCustomer(id) {
  const intId = parseInt(id, 10);

  if (!isValidId(intId)) {
    return Promise.reject(new Error("L'ID du client doit être un entier."));
  }

  return customerExists(intId)
    .then(exists => {
      if (!exists) {
        return Promise.reject(new Error(`Le client avec l'ID ${intId} n'existe pas.`));
      }

      const query = 'DELETE FROM customers WHERE id = ?';
      return new Promise((resolve, reject) => {
        db.query(query, [intId], (err, result) => {
          if (err) {
            console.error('Erreur lors de la suppression du client:', err);
            return reject(new Error("Une erreur est survenue lors de la suppression du client. Veuillez réessayer."));
          }
          resolve(result);
        });
      });
    });
}

// Fonctions auxiliaires pour validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{8,20}$/;
  return phoneRegex.test(phone);
}

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
};