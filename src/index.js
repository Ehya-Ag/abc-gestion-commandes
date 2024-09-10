const readlineSync = require('readline-sync');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('./customerModule');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('./productModule');
const { getPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = require('./purchaseOrderModule');

// Menu principal
function displayMainMenu() {
  console.log('\n--- Menu Principal ---');
  console.log('1. Gestion des clients');
  console.log('2. Gestion des produits');
  console.log('3. Gestion des bons de commande');
  console.log('0. Quitter');

  const choice = readlineSync.question('Votre choix: ');
  handleMainMenu(choice);
}

// Menu pour les clients
function displayCustomerMenu() {
  console.log('\n--- Menu Clients ---');
  console.log('1. Liste des clients');
  console.log('2. Ajouter un client');
  console.log('3. Mettre à jour un client');
  console.log('4. Supprimer un client');
  console.log('0. Retour au menu principal');

  const choice = readlineSync.question('Votre choix: ');
  handleCustomerMenu(choice);
}

// Menu pour les produits
function displayProductMenu() {
  console.log('\n--- Menu Produits ---');
  console.log('1. Liste des produits');
  console.log('2. Ajouter un produit');
  console.log('3. Mettre à jour un produit');
  console.log('4. Supprimer un produit');
  console.log('0. Retour au menu principal');

  const choice = readlineSync.question('Votre choix: ');
  handleProductMenu(choice);
}

// Menu pour les bons de commande
function displayPurchaseOrderMenu() {
  console.log('\n--- Menu Bons de commande ---');
  console.log('1. Liste des bons de commande');
  console.log('2. Ajouter un bon de commande');
  console.log('3. Mettre à jour un bon de commande');
  console.log('4. Supprimer un bon de commande');
  console.log('0. Retour au menu principal');

  const choice = readlineSync.question('Votre choix: ');
  handlePurchaseOrderMenu(choice);
}

// Gestion du menu principal
function handleMainMenu(choice) {
  switch (choice) {
    case '1':
      displayCustomerMenu();
      break;
    case '2':
      displayProductMenu();
      break;
    case '3':
      displayPurchaseOrderMenu();
      break;
    case '0':
      console.log('Au revoir !');
      break;
    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayMainMenu();
  }
}

// Gestion du menu client
function handleCustomerMenu(choice) {
  switch (choice) {
    case '1':
      getCustomers()
        .then((customers) => {
          console.log('\n--- Liste des clients ---');
          customers.forEach(customer => {
            console.log(`ID: ${customer.id}, Nom: ${customer.name}, Adresse: ${customer.address}, Email: ${customer.email}, Téléphone: ${customer.phone}`);
          });
          displayCustomerMenu(); 
        })
        .catch((err) => console.error(err));
      break;
    case '2':
      const name = readlineSync.question('Nom du client : ');
      const address = readlineSync.question('Adresse : ');
      const email = readlineSync.question('Email : ');
      const phone = readlineSync.question('Téléphone : ');
      
      addCustomer(name, address, email, phone)
        .then(() => {
          console.log('Client ajouté avec succès.');
          displayCustomerMenu();
        })
        .catch((err) => console.error(err));
      break;
    case '3':
      const idToUpdate = readlineSync.question('ID du client à mettre à jour : ');
      const newName = readlineSync.question('Nouveau nom : ');
      const newAddress = readlineSync.question('Nouvelle adresse : ');
      const newEmail = readlineSync.question('Nouvel email : ');
      const newPhone = readlineSync.question('Nouveau téléphone : ');

      updateCustomer(idToUpdate, newName, newAddress, newEmail, newPhone)
        .then(() => {
          console.log('Client mis à jour avec succès.');
          displayCustomerMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '4':
      const idToDelete = readlineSync.question('ID du client à supprimer : ');

      deleteCustomer(idToDelete)
        .then(() => {
          console.log('Client supprimé avec succès.');
          displayCustomerMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '0':
      displayMainMenu(); 
      break;
    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayCustomerMenu();
  }
}

// Gestion du menu produit
function handleProductMenu(choice) {
  switch (choice) {
    case '1':
      getProducts()
        .then((products) => {
          console.log('\n--- Liste des produits ---');
          products.forEach(product => {
            console.log(`ID: ${product.id}, Nom: ${product.name}, Prix: ${product.price}, Stock: ${product.stock}`);
          });
          displayProductMenu(); 
        })
        .catch((err) => console.error(err));
      break;
    case '2':
      const productName = readlineSync.question('Nom du produit : ');
      const productPrice = readlineSync.question('Prix : ');
      const productStock = readlineSync.question('Stock : ');

      addProduct(productName, productPrice, productStock)
        .then(() => {
          console.log('Produit ajouté avec succès.');
          displayProductMenu();
        })
        .catch((err) => console.error(err));
      break;
    case '3':
      const productIdToUpdate = readlineSync.question('ID du produit à mettre à jour : ');
      const newProductName = readlineSync.question('Nouveau nom : ');
      const newProductPrice = readlineSync.question('Nouveau prix : ');
      const newProductStock = readlineSync.question('Nouveau stock : ');

      updateProduct(productIdToUpdate, newProductName, newProductPrice, newProductStock)
        .then(() => {
          console.log('Produit mis à jour avec succès.');
          displayProductMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '4':
      const productIdToDelete = readlineSync.question('ID du produit à supprimer : ');

      deleteProduct(productIdToDelete)
        .then(() => {
          console.log('Produit supprimé avec succès.');
          displayProductMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '0':
      displayMainMenu(); 
      break;
    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayProductMenu();
  }
}

// Gestion du menu bons de commande
function handlePurchaseOrderMenu(choice) {
  switch (choice) {
    case '1':
      getPurchaseOrders()
        .then((orders) => {
          console.log('\n--- Liste des bons de commande ---');
          orders.forEach(order => {
            console.log(`ID: ${order.id}, Client: ${order.customer_id}, Date: ${order.date}, Adresse: ${order.delivery_address}, Suivi: ${order.track_number}, Statut: ${order.status}`);
          });
          displayPurchaseOrderMenu();
        })
        .catch((err) => console.error(err));
      break;
    case '2':
      const customer_id = readlineSync.question('ID du client : ');
      const date = readlineSync.question('Date (YYYY-MM-DD) : ');
      const delivery_address = readlineSync.question('Adresse de livraison : ');
      const track_number = readlineSync.question('Numéro de suivi : ');
      const status = readlineSync.question('Statut : ');

      addPurchaseOrder({ customer_id, date, delivery_address, track_number, status })
        .then(() => {
          console.log('Bon de commande ajouté avec succès.');
          displayPurchaseOrderMenu();
        })
        .catch((err) => console.error(err));
      break;
    case '3':
      const idToUpdate = readlineSync.question('ID du bon de commande à mettre à jour : ');
      const newCustomer_id = readlineSync.question('Nouvel ID du client : ');
      const newDate = readlineSync.question('Nouvelle date (YYYY-MM-DD) : ');
      const newDelivery_address = readlineSync.question('Nouvelle adresse de livraison : ');
      const newTrack_number = readlineSync.question('Nouveau numéro de suivi : ');
      const newStatus = readlineSync.question('Nouveau statut : ');

      updatePurchaseOrder(idToUpdate, { customer_id: newCustomer_id, date: newDate, delivery_address: newDelivery_address, track_number: newTrack_number, status: newStatus })
        .then(() => {
          console.log('Bon de commande mis à jour avec succès.');
          displayPurchaseOrderMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '4':
      const idToDelete = readlineSync.question('ID du bon de commande à supprimer : ');

      deletePurchaseOrder(idToDelete)
        .then(() => {
          console.log('Bon de commande supprimé avec succès.');
          displayPurchaseOrderMenu();
        })
        .catch((err) => console.error('Erreur :', err.message));
      break;
    case '0':
      displayMainMenu();
      break;
    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayPurchaseOrderMenu();
  }
}

// Démarrer l'application
displayMainMenu();
