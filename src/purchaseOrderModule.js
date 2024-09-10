const db = require('./config/db');
const readlineSync = require('readline-sync');

// Lister les bons de commanddes
function getPurchaseOrders() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM purchase_orders';
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log('\n--- Liste des bons de commande ---');
      console.table(results);
      resolve(results);
    });
  });
}

// Ajout bon de commande
function addPurchaseOrder({ customer_id, date, delivery_address, track_number, status }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO purchase_orders (customer_id, date, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [customer_id, date, delivery_address, track_number, status], async (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log('Bon de commande ajouté avec succès !');

      const order_id = result.insertId;
      await addOrderDetails(order_id);
      resolve(result);
    });
  });
}

// Ajout du detail
async function addOrderDetails(order_id) {
  let continueAdding = true;
  const orderDetails = [];

  while (continueAdding) {
    const product_id = readlineSync.question('Saisissez l\'ID du produit : ');
    const quantity = readlineSync.questionInt('Saisissez la quantité : ');

    // Vérification de l'existence du produit
    const product = await getProductById(product_id);
    if (!product) {
      console.log(`Le produit avec l'ID ${product_id} n'existe pas.`);
      continue;
    }

    const price = product.price;

    // Ajouter le détail de la commande à la liste
    orderDetails.push({ order_id, product_id, quantity, price });

    const nextAction = readlineSync.question('Voulez-vous ajouter un autre produit ? (o/n) : ');
    if (nextAction.toLowerCase() !== 'o') {
      continueAdding = false;
    }
  }

  // Choix entre sauvegarder ou annuler
  const saveOrder = readlineSync.question('Voulez-vous sauvegarder les détails de commande ? (o/n) : ');
  if (saveOrder.toLowerCase() === 'o') {
    // Enregistrer les détails de commande dans la base de données
    for (const detail of orderDetails) {
      await saveOrderDetail(detail);
    }
    console.log('Détails de commande enregistrés avec succès !');
  } else {
    console.log('Annulation de l\'ajout des détails de commande.');
  }
}

// Pour l'enregistrement
function saveOrderDetail({ order_id, product_id, quantity, price }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(query, [order_id, product_id, quantity, price], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Par id
function getProductById(product_id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [product_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
}

// Pour la mise à jour
function updatePurchaseOrder(id, { customer_id, date, delivery_address, track_number, status }) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE purchase_orders SET customer_id = ?, date = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?';
    db.query(query, [customer_id, date, delivery_address, track_number, status, id], (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(`Bon de commande avec l'ID ${id} mis à jour avec succès !`);
      resolve(result);
    });
  });
}

// Pour la suppression
function deletePurchaseOrder(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM purchase_orders WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(`Bon de commande avec l'ID ${id} supprimé avec succès !`);
      resolve(result);
    });
  });
}

module.exports = {
  getPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
