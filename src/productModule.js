const db = require('./config/db');

// Pour lister
function getProducts() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log('\n--- Liste des produits ---');
      console.table(results);
      resolve(results);
    });
  });
}

// Par id
function getProductById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return resolve(null); 
      }
      resolve(results[0]); 
    });
  });
}

// Ajout
function addProduct({ name, description, price, stock, category, barcode, status }) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, price, stock, category, barcode, status], (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(`Produit '${name}' ajouté avec succès !`);
      resolve(result);
    });
  });
}

// Mettre a jour
function updateProduct(id, { name, description, price, stock, category, barcode, status }) {
  return new Promise(async (resolve, reject) => {
    try {
      const existingProduct = await getProductById(id);
      if (!existingProduct) {
        return reject(new Error(`Produit avec l'ID ${id} non trouvé.`));
      }


      const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?';
      db.query(query, [name, description, price, stock, category, barcode, status, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(`Produit avec l'ID ${id} mis à jour avec succès !`);
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Suppression
function deleteProduct(id) {
  return new Promise(async (resolve, reject) => {
    try {
      
      const existingProduct = await getProductById(id);
      if (!existingProduct) {
        return reject(new Error(`Produit avec l'ID ${id} non trouvé.`));
      }

      
      const query = 'DELETE FROM products WHERE id = ?';
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(`Produit avec l'ID ${id} supprimé avec succès !`);
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
