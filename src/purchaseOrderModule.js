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

// Ajout d'un bon de commande avec gestion des transactions
async function addPurchaseOrder({ customer_id, date, delivery_address, track_number, status }) {
  const orderDetails = await addOrderDetails(); 

  const saveOrder = readlineSync.question('Voulez-vous sauvegarder le bon de commande et ses détails ? (o/n) : ');
  
  if (saveOrder.toLowerCase() === 'o') {
    try {
      await beginTransaction();
      const result = await insertPurchaseOrder({ customer_id, date, delivery_address, track_number, status });
      const order_id = result.insertId;

      for (const detail of orderDetails) {
        detail.order_id = order_id;
        await saveOrderDetail(detail);
      }

      // Valider la transaction
      await commitTransaction();
      console.log('Bon de commande et détails enregistrés avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'ajout, annulation de la transaction :', err);
      await rollbackTransaction();
    }
  } else {
    console.log('Annulation de l\'ajout du bon de commande et des détails.');
  }
}

// Commencer la transaction
function beginTransaction() {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function commitTransaction() {
  return new Promise((resolve, reject) => {
    db.commit((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}


function rollbackTransaction() {
  return new Promise((resolve, reject) => {
    db.rollback((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// Insérer un bon de commande
function insertPurchaseOrder({ customer_id, date, delivery_address, track_number, status }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO purchase_orders (customer_id, date, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [customer_id, date, delivery_address, track_number, status], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

async function addOrderDetails() {
  let continueAdding = true;
  const orderDetails = [];

  while (continueAdding) {
    const product_id = readlineSync.question('Saisissez l\'ID du produit : ');
    const quantity = readlineSync.questionInt('Saisissez la quantité : ');
    const product = await getProductById(product_id);
    if (!product) {
      console.log(`Le produit avec l'ID ${product_id} n'existe pas.`);
      continue;
    }

    const price = product.price;
    orderDetails.push({ product_id, quantity, price });

    const nextAction = readlineSync.question('Voulez-vous ajouter un autre produit ? (o/n) : ');
    if (nextAction.toLowerCase() !== 'o') {
      continueAdding = false;
    }
  }

  return orderDetails;
}

// Enregistrer un détail de commande
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
      updateOrderDetails(id)
        .then(() => resolve(result))
        .catch((detailErr) => reject(detailErr));
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

function getOrderDetails(order_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        order_details.id, 
        order_details.order_id, 
        order_details.product_id, 
        order_details.quantity, 
        order_details.price, 
        customers.name AS customer_name 
      FROM order_details 
      JOIN purchase_orders ON order_details.order_id = purchase_orders.id 
      JOIN customers ON purchase_orders.customer_id = customers.id 
      WHERE order_details.order_id = ?
    `;
    db.query(query, [order_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        console.log('Aucun détail de commande trouvé pour cet ID.');
      } else {
        console.log(`\n--- Détails de la commande pour l'ID ${order_id} ---`);
        console.table(results);
      }
      resolve(results);
    });
  });
}
// mettre a jour details
function getProductPrice(productId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT price FROM products WHERE id = ?';
    db.query(query, [productId], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return reject(new Error(`Produit avec l'ID ${productId} non trouvé.`));
      }
      resolve(results[0].price);
    });
  });
}
async function updateOrderDetails(orderId) {
  try {
    const details = await getOrderDetails(orderId);

    let continueUpdating = true;

    while (continueUpdating) {
      console.log('Détails de la commande actuels :');
      details.forEach((detail, index) => {
        console.log(`ID: ${detail.id}, Produit ID: ${detail.product_id}, Quantité: ${detail.quantity}`);
      });

      const detailId = readlineSync.question('ID du détail à mettre à jour : ');

      // Vérifie si l'ID du détail existe dans les détails récupérés
      const detailToUpdate = details.find(detail => detail.id == detailId);
      if (!detailToUpdate) {
        console.log(`Détail avec l'ID ${detailId} non trouvé.`);
        continue;
      }

      const newProductId = readlineSync.question('Nouvel ID du produit : ');
      const newQuantity = readlineSync.questionInt('Nouvelle quantité : ');
      const newUnitPrice = await getProductPrice(newProductId);

      console.log(`Détails à mettre à jour : ID = ${detailId}, Nouveau produit ID = ${newProductId}, Nouvelle quantité = ${newQuantity}, Nouveau prix unitaire = ${newUnitPrice}`);

      const updateQuery = 'UPDATE order_details SET product_id = ?, quantity = ?, price = ? WHERE id = ? AND order_id = ?';
      await new Promise((resolve, reject) => {
        db.query(updateQuery, [newProductId, newQuantity, newUnitPrice, detailId, orderId], (err, result) => {
          if (err) {
            return reject(err);
          }
          console.log(`Détail de commande avec l'ID ${detailId} mis à jour avec succès !`);
          resolve(result);
        });
      });
      // Recharger les détails après mise à jour
      const updatedDetails = await getOrderDetails(orderId);
      console.log('Détails de la commande mis à jour :');
      updatedDetails.forEach((detail, index) => {
        console.log(`ID: ${detail.id}, Produit ID: ${detail.product_id}, Quantité: ${detail.quantity}`);
      });
      const anotherUpdate = readlineSync.keyInYNStrict('Voulez-vous modifier un autre détail (y= oui, n= non) ?');
      continueUpdating = anotherUpdate;
    }

    console.log('Tous les détails ont été mis à jour.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des détails de la commande :', error.message);
  }
}
module.exports = {
  getPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getOrderDetails,
};
