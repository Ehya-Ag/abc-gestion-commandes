const db = require('./config/db');

// Exemple de code appelant addPayment
// Vérifier si un paiement avec un ID spécifique existe
function paymentExists(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM payments WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(new Error("Erreur lors de la vérification de l'existence du paiement."));
      }
      resolve(results[0].count > 0); 
    });
  });
}

// Vérifier si l'ID de commande existe dans la table purchase_orders
function orderExists(order_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?';
      db.query(query, [order_id], (err, results) => {
        if (err) {
          return reject(new Error("Erreur lors de la vérification de l'ID de commande."));
        }
        resolve(results[0].count > 0);
      });
    });
  }
  

function getPayments() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM payments';
    db.query(query, (err, results) => {
      if (err) {
        return reject(new Error("Une erreur s'est produite lors de la récupération des paiements."));
      }
      if (results.length === 0) {
        console.log('Aucun paiement trouvé.');
      } else {
        console.log('\n--- Liste des paiements ---');
        console.table(results);
      }
      resolve(results);
    });
  });
}

// Valider les données de paiement
function validatePaymentData({ order_id, date, amount, payment_method }) {
    if (!order_id || isNaN(parseInt(order_id))) {
      return { valid: false, message: "L'ID de la commande est invalide." };
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { valid: false, message: "La date est invalide. Utilisez le format YYYY-MM-DD." };
    }
    if (!amount || isNaN(parseFloat(amount))) {
      return { valid: false, message: "Le montant est invalide." };
    }
    if (!payment_method || payment_method.trim().length === 0) {
      return { valid: false, message: "La méthode de paiement est manquante ou invalide." };
    }
    return { valid: true };
  }
  

  function addPayment(paymentData) {
    const validation = validatePaymentData(paymentData);
    if (!validation.valid) {
      console.error("Validation échouée :", validation.message);
      return Promise.reject(new Error(validation.message));
    }
  
    const { order_id, date, amount, payment_method } = paymentData;
  
    console.log("Validation réussie, vérification de l'existence de l'ID de commande :", order_id);
  
    return orderExists(order_id).then((exists) => {
      if (!exists) {
        console.error(`L'ID de commande ${order_id} n'existe pas dans la table des commandes.`);
        return Promise.reject(new Error(`L'ID de commande ${order_id} n'existe pas dans la table des commandes.`));
      }
  
      // Ajouter le paiement si l'ID de commande est valide
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO payments (order_id, date, amount, payment_method) VALUES (?, ?, ?, ?)';
        db.query(query, [order_id, date, amount, payment_method], (err, result) => {
          if (err) {
            console.error("Erreur lors de l'ajout du paiement :", err.message);
            return reject(new Error("Erreur lors de l'ajout du paiement. Veuillez vérifier les données et réessayer."));
          }
          console.log('Paiement ajouté avec succès.');
          resolve(result);
        });
      });
    }).catch(err => {
      console.error("Erreur lors de l'ajout du paiement :", err.message);
      throw err;
    });
  }
  
function updatePayment(id, paymentData) {
  const validation = validatePaymentData(paymentData);
  if (!validation.valid) {
    return Promise.reject(new Error(validation.message));
  }

  return paymentExists(id).then((exists) => {
    if (!exists) {
      return Promise.reject(new Error(`Le paiement avec l'ID ${id} n'existe pas.`));
    }

    const { order_id, date, amount, payment_method } = paymentData;
    return orderExists(order_id).then((orderExists) => {
      if (!orderExists) {
        return Promise.reject(new Error(`L'ID de commande ${order_id} n'existe pas dans la table des commandes.`));
      }

      return new Promise((resolve, reject) => {
        const query = 'UPDATE payments SET order_id = ?, date = ?, amount = ?, payment_method = ? WHERE id = ?';
        db.query(query, [order_id, date, amount, payment_method, id], (err, result) => {
          if (err) {
            return reject(new Error("Erreur lors de la mise à jour du paiement. Veuillez réessayer."));
          }
          console.log(`Paiement avec ID ${id} mis à jour avec succès.`);
          resolve(result);
        });
      });
    });
  });
}

function deletePayment(id) {
  return paymentExists(id).then((exists) => {
    if (!exists) {
      return Promise.reject(new Error(`Le paiement avec l'ID ${id} n'existe pas.`));
    }

    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM payments WHERE id = ?';
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(new Error("Erreur lors de la suppression du paiement. Veuillez réessayer."));
        }
        console.log(`Paiement avec ID ${id} supprimé avec succès.`);
        resolve(result);
      });
    });
  });
}

module.exports = {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
};
