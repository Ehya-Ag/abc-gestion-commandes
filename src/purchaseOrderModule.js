const { errorMessages } = require('vue/compiler-sfc');
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
  const customerExists = await checkIfCustomerExists(customer_id);
  if (!customerExists) {
    console.error(`Erreur : Le client avec l'ID ${customer_id} n'existe pas.`);
    return;
  }
  const orderDetails = await addOrderDetails();
  if (!orderDetails.length) {
    console.log("Aucun détail de commande ajouté.");
    return;
  }

  const saveOrder = readlineSync.question('Voulez-vous sauvegarder le bon de commande et ses détails ? (o/n) : ');

  if (saveOrder.toLowerCase() === 'o') {
    try {
      // Démarrer la transaction et obtenir la connexion
      const connection = await getConnection();
      await beginTransaction(connection);

      // Insérer le bon de commande
      const result = await insertPurchaseOrder(connection, { customer_id, date, delivery_address, track_number, status });
      const order_id = result.insertId;

      // Enregistrer les détails du bon de commande
      for (const detail of orderDetails) {
        detail.order_id = order_id;
        await saveOrderDetail(connection, detail);
      }

      // Valider la transaction
      await commitTransaction(connection);
      console.log('Bon de commande et détails enregistrés avec succès !');
      connection.release(); 
    } catch (err) {
      console.error('Erreur lors de l\'ajout, verifier bien les données saisi');
      await rollbackTransaction(connection);
      connection.release();
    }
  } else {
    console.log('Annulation de l\'ajout du bon de commande et des détails.');
  }
}

// Vérification si le client existe
function checkIfCustomerExists(customer_id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM customers WHERE id = ?';
    db.query(query, [customer_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0].count > 0);
    });
  });
}
// Démarrer la transaction
function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
// Valider la transaction
function commitTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// Annuler la transaction
function rollbackTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function getConnection() {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      resolve(connection);
    });
  });
}

// Insérer un bon de commande
function insertPurchaseOrder(connection, { customer_id, date, delivery_address, track_number, status }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO purchase_orders (customer_id, date, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [customer_id, date, delivery_address, track_number, status], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

function saveOrderDetail(connection, { order_id, product_id, quantity, price }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
    connection.query(query, [order_id, product_id, quantity, price], (err, result) => {
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

    const product = await getProductById(product_id);
    if (!product) {
      console.log(`Erreur : Le produit avec l'ID ${product_id} n'existe pas.`);
      continue;
    }
    const quantity = readlineSync.questionInt('Saisissez la quantité : ');
    if (orderDetails.some(detail => detail.product_id === product_id)) {
      console.log('Erreur : Ce produit a déjà été ajouté à la commande.');
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

function getOrderDetails(order_id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        purchase_orders.id AS purchase_order_id,
        purchase_orders.customer_id,
        purchase_orders.date,
        purchase_orders.track_number,
        purchase_orders.status,
        purchase_orders.delivery_address,
        order_details.id AS order_detail_id, 
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
        resolve([]);
      } else {
        const purchaseOrder = {
          id: results[0].purchase_order_id,
          customer_id: results[0].customer_id,
          date: results[0].date,
          track_number: results[0].track_number,
          status: results[0].status,
          delivery_address: results[0].delivery_address
        };
        console.log(`\n--- Informations de la commande pour l'ID ${order_id} et ses details---`);
        console.table([purchaseOrder]);
        console.table(results.map(detail => ({
          order_detail_id: detail.order_detail_id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: detail.price,
          customer_name: detail.customer_name
        })));
      }
      resolve(results);
    });
  });
}
function saveOrUpdateOrderDetail(connection, { order_id, product_id, quantity, price }) {
  return new Promise((resolve, reject) => {
    const checkQuery = 'SELECT * FROM order_details WHERE order_id = ? AND product_id = ?';
    connection.query(checkQuery, [order_id, product_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length > 0) {
        const updateQuery = 'UPDATE order_details SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?';
        connection.query(updateQuery, [quantity, price, order_id, product_id], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve({ message: 'Détail de commande mis à jour avec succès.' });
        });
      } else {
        resolve({ message: 'Le détail de commande n\'est pas associé à la commande.' });
      }
    });
  });
}
// Pour la mise à jour
async function updatePurchaseOrder(orderId, { customer_id, date, delivery_address, track_number, status }) {
  const orderExists = await checkIfPurchaseOrderExists(orderId);
  if (!orderExists) {
    console.error(`Erreur : Le bon de commande avec l'ID ${orderId} n'existe pas.`);
    return;
  }
  const currentDetails = await getOrderDetails(orderId);
  const newDetails = await addOrUpdateOrderDetails(orderId, currentDetails);

  if (!newDetails.length) {
    console.log("Aucun détail de commande modifié.");
    return;
  }

  const saveChanges = readlineSync.question('Voulez-vous sauvegarder les modifications du bon de commande et de ses détails ? (o/n) : ');

  if (saveChanges.toLowerCase() === 'o') {
    try {
      const connection = await getConnection();
      await beginTransaction(connection);
      await updateOrder(connection, orderId, { customer_id, date, delivery_address, track_number, status });
      for (const detail of newDetails) {
        await saveOrUpdateOrderDetail(connection, detail);
      }

      await commitTransaction(connection);
      console.log('Bon de commande et détails mis à jour avec succès !');
      connection.release();
    } catch (err) {
      console.error('Erreur lors de la mise à jour, veuillez vérifier les données.');
      await rollbackTransaction(connection);
      connection.release();
    }
  } else {
    console.log('Annulation de la mise à jour du bon de commande et des détails.');
  }
}

// Vérifier si un bon de commande existe
function checkIfPurchaseOrderExists(orderId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?';
    db.query(query, [orderId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0].count > 0);
    });
  });
}
function updateOrder(connection, orderId, { customer_id, date, delivery_address, track_number, status }) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE purchase_orders SET customer_id = ?, date = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?';
    connection.query(query, [customer_id, date, delivery_address, track_number, status, orderId], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Ajouter ou mettre à jour les détails de commande
async function addOrUpdateOrderDetails(orderId, currentDetails) {
  let continueAdding = true;
  const updatedDetails = [];

  while (continueAdding) {
    const product_id = readlineSync.question('Saisissez l\'ID du produit : ');

    const product = await getProductById(product_id);
    if (!product) {
      console.log(`Erreur : Le produit avec l'ID ${product_id} n'existe pas.`);
      continue;
    }

    const quantity = readlineSync.questionInt('Saisissez la quantité : ');
    const price = product.price;

    const existingDetail = currentDetails.find(detail => detail.product_id === product_id);

    if (existingDetail) {
      // Mise à jour d'un détail existant
      await updateOrderDetail(orderId, existingDetail.id, quantity, price);
    } else {
      // Ajout d'un nouveau détail
      updatedDetails.push({ order_id: orderId, product_id, quantity, price });
    }

    const nextAction = readlineSync.question('Voulez-vous ajouter ou mettre à jour un autre produit ? (o/n) : ');
    if (nextAction.toLowerCase() !== 'o') {
      continueAdding = false;
    }
  }

  return updatedDetails;
}

function updateOrderDetail(orderId, detailId, quantity, price) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE order_details SET quantity = ?, price = ? WHERE id = ? AND order_id = ?';
    db.query(query, [quantity, price, detailId, orderId], (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(`Détail de commande avec l'ID ${detailId} mis à jour avec succès !`);
      resolve(result);
    });
  });
}

// Pour la suppression
function deletePurchaseOrder(id) {
  return new Promise((resolve, reject) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM purchase_orders WHERE id = ?';
    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results[0].count === 0) {
        return reject(new Error(`Le bon de commande avec l'ID ${id} n'existe pas.`));
      }
      const deleteQuery = 'DELETE FROM purchase_orders WHERE id = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(`Bon de commande avec l'ID ${id} supprimé avec succès !`);
        resolve(result);
      });
    });
  });
}
module.exports = {
  getPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getOrderDetails,
};
