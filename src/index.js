const readlineSync = require('readline-sync');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('./customerModule');
const { getProducts, addProduct, updateProduct, deleteProduct } = require('./productModule');
const { getPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, getOrderDetails } = require('./purchaseOrderModule');
const { getPayments, addPayment, updatePayment, deletePayment } = require('./paymentModule');


// Menu principal
function displayMainMenu() {
  console.log('\n--- Menu Principal ---');
  console.log('1. Gestion des clients');
  console.log('2. Gestion des produits');
  console.log('3. Gestion des bons de commande');
  console.log('4. Gestion des paiements');
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
  console.log('\n--- Menu de gestion des bons de commande ---');
  console.log('1. Lister les bons de commande');
  console.log('2. Ajouter un bon de commande');
  console.log('3. Mettre à jour un bon de commande');
  console.log('4. Supprimer un bon de commande');
  console.log('5. Afficher les détails d\'une commande');
  console.log('0. Retour au menu principal');
  const choice = readlineSync.question('Choisissez une option : ');
  handlePurchaseOrderMenu(choice);
}

//Menu pour les payements
function displayPaymentMenu() {
  console.log('\n--- Menu Paiements ---');
  console.log('1. Liste des paiements');
  console.log('2. Ajouter un paiement');
  console.log('3. Mettre à jour un paiement');
  console.log('4. Supprimer un paiement');
  console.log('0. Retour au menu principal');

  const choice = readlineSync.question('Votre choix: ');
  handlePaymentMenu(choice);
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
    case '4': 
      displayPaymentMenu();
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
        .catch((err) => {
          console.error('Erreur lors de la récupération des clients :', err.message);
          displayCustomerMenu(); 
        });
      break;
    case '2':
      try {
        const name = readlineSync.question('Nom du client : ');
        const address = readlineSync.question('Adresse : ');
        const email = readlineSync.question('Email : ');
        const phone = readlineSync.question('Téléphone : ');

        addCustomer(name, address, email, phone)
          .then(() => {
            console.log('Client ajouté avec succès.');
            displayCustomerMenu(); 
          })
          .catch((err) => {
            console.error('Erreur lors de l\'ajout du client :', err.message);
            displayCustomerMenu(); 
          });
      } catch (err) {
        console.error('Erreur dans les données saisies :', err.message);
        displayCustomerMenu(); 
      }
      break;
    case '3':
      try {
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
          .catch((err) => {
            console.error('Erreur lors de la mise à jour du client :', err.message);
            displayCustomerMenu(); 
          });
      } catch (err) {
        console.error('Erreur dans les données saisies :', err.message);
        displayCustomerMenu(); 
      }
      break;
    case '4':
      try {
        const idToDelete = readlineSync.question('ID du client à supprimer : ');

        deleteCustomer(idToDelete)
          .then(() => {
            console.log('Client supprimé avec succès.');
            displayCustomerMenu();
          })
          .catch((err) => {
            console.error('Erreur lors de la suppression du client :', err.message);
            displayCustomerMenu(); 
          });
      } catch (err) {
        console.error('Erreur dans les données saisies :', err.message);
        displayCustomerMenu(); 
      }
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
          if (products.length === 0) {
            console.log('Aucun produit disponible.');
          } 
          displayProductMenu();
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des produits :', err.message);
          displayProductMenu();
        });
      break;

    case '2': 
      const productName = readlineSync.question('Nom du produit : ');
      const productDescription = readlineSync.question('Description : ');
      const productPrice = readlineSync.questionFloat('Prix : ');
      const productStock = readlineSync.questionInt('Stock : ');
      const productCategory = readlineSync.question('Catégorie : ');
      const productBarcode = readlineSync.question('Code-barres : ');
      const productStatus = readlineSync.question('Statut : ');

      // Validation des champs obligatoires
      if (!productName || !productDescription || !productPrice || !productStock || !productCategory || !productBarcode || !productStatus) {
        console.error('Tous les champs sont obligatoires pour ajouter un produit.');
        return displayProductMenu();
      }

      addProduct({ name: productName, description: productDescription, price: productPrice, stock: productStock, category: productCategory, barcode: productBarcode, status: productStatus })
        .then(() => {
          console.log('Produit ajouté avec succès.');
          displayProductMenu(); 
        })
        .catch((err) => {
          console.error('Erreur lors de l\'ajout du produit :', err.message);
          displayProductMenu(); 
        });
      break;

    case '3': 
      const productIdToUpdate = readlineSync.questionInt('ID du produit à mettre à jour : ');

      const newProductName = readlineSync.question('Nouveau nom (laisser vide pour conserver l\'ancien) : ');
      const newProductDescription = readlineSync.question('Nouvelle description (laisser vide pour conserver l\'ancienne) : ');
      const newProductPrice = readlineSync.questionFloat('Nouveau prix (laisser vide pour conserver l\'ancien) : ', { defaultInput: '' });
      const newProductStock = readlineSync.questionInt('Nouveau stock (laisser vide pour conserver l\'ancien) : ', { defaultInput: '' });
      const newProductCategory = readlineSync.question('Nouvelle catégorie (laisser vide pour conserver l\'ancienne) : ');
      const newProductBarcode = readlineSync.question('Nouveau code-barres (laisser vide pour conserver l\'ancien) : ');
      const newProductStatus = readlineSync.question('Nouveau statut (laisser vide pour conserver l\'ancien) : ');

      updateProduct(productIdToUpdate, {
        name: newProductName || undefined,
        description: newProductDescription || undefined,
        price: newProductPrice || undefined,
        stock: newProductStock || undefined,
        category: newProductCategory || undefined,
        barcode: newProductBarcode || undefined,
        status: newProductStatus || undefined
      })
        .then(() => {
          console.log('Produit mis à jour avec succès.');
          displayProductMenu();
        })
        .catch((err) => {
          console.error('Erreur lors de la mise à jour du produit :', err.message);
          displayProductMenu(); 
        });
      break;

    case '4': 
      const productIdToDelete = readlineSync.questionInt('ID du produit à supprimer : ');

      deleteProduct(productIdToDelete)
        .then(() => {
          console.log('Produit supprimé avec succès.');
          displayProductMenu();
        })
        .catch((err) => {
          console.error('Erreur lors de la suppression du produit :', err.message);
          displayProductMenu(); 
        });
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
        .then(() => {
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
        .catch((err) => {
          console.error(err)
          displayPurchaseOrderMenu();
  });
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
            console.log('Bon de commande et détails mis à jour avec succès.');
            displayPurchaseOrderMenu();
          })
          .catch((err) => {
            console.error('Erreur lors de la mise à jour du bon de commande :', err.message);
            displayPurchaseOrderMenu();
          });
        break;
       
    case '4':
      const idToDelete = readlineSync.question('ID du bon de commande à supprimer : ');

      deletePurchaseOrder(idToDelete)
        .then(() => {
          console.log('Bon de commande supprimé avec succès.');
          displayPurchaseOrderMenu();
        })
        .catch((err) => {
          console.error('Erreur :', err.message)
          displayPurchaseOrderMenu();
        });
      break;
    case '5':  
      const order_id = readlineSync.questionInt('Saisissez l\'ID de la commande : ');

      getOrderDetails(order_id)
        .then(() => {
          displayPurchaseOrderMenu();
        })
        .catch((err) => {
          console.error('Erreur lors de l\'affichage des détails de la commande :', err.message);
          displayPurchaseOrderMenu();
        });
      break;
    case '0':
      displayMainMenu();
      break;
    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayPurchaseOrderMenu();
  }
}
// Gestion du menu paiements
function handlePaymentMenu(choice) {
  switch (choice) {
    case '1':
      getPayments()
        .then((payments) => {
          displayPaymentMenu(); 
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des paiements :', err.message);
          displayPaymentMenu(); 
        });
      break;

    case '2':
      const order_id = readlineSync.questionInt('ID du bon de commande : ');
      const amount = readlineSync.questionFloat('Montant : ');
      const date = readlineSync.question('Date (YYYY-MM-DD) : ');
      const payment_method = readlineSync.question('Méthode de paiement : ');

      const paymentData = {
        order_id,
        date,
        amount,
        payment_method
      };

      addPayment(paymentData)
        .then(() => {
          console.log('Paiement ajouté avec succès.');
          displayPaymentMenu(); 
        })
        .catch((err) => {
          console.error('Erreur lors de l\'ajout du paiement :', err.message);
          displayPaymentMenu(); 
        });
      break;

    case '3':
      const paymentIdToUpdate = readlineSync.questionInt('ID du paiement à mettre à jour : ');
      const newOrderId = readlineSync.questionInt('Nouvel ID du bon de commande : ');
      const newAmount = readlineSync.questionFloat('Nouveau montant : ');
      const newDate = readlineSync.question('Nouvelle date (YYYY-MM-DD) : ');
      const newPaymentMethod = readlineSync.question('Nouvelle méthode de paiement : ');

      const updatedPaymentData = {
        order_id: newOrderId,
        date: newDate,
        amount: newAmount,
        payment_method: newPaymentMethod
      };

      updatePayment(paymentIdToUpdate, updatedPaymentData)
        .then(() => {
          console.log('Paiement mis à jour avec succès.');
          displayPaymentMenu();
        })
        .catch((err) => {
          console.error('Erreur lors de la mise à jour du paiement :', err.message);
          displayPaymentMenu();
        });
      break;

    case '4':
      const paymentIdToDelete = readlineSync.questionInt('ID du paiement à supprimer : ');

      deletePayment(paymentIdToDelete)
        .then(() => {
          console.log('Paiement supprimé avec succès.');
          displayPaymentMenu(); 
        })
        .catch((err) => {
          console.error('Erreur lors de la suppression du paiement :', err.message);
          displayPaymentMenu();
        });
      break;

    case '0':
      
      displayMainMenu();
      break;

    default:
      console.log('Choix invalide, veuillez réessayer.');
      displayPaymentMenu(); 
  }
}

// Fonction d'affichage du menu des paiements
function displayPaymentMenu() {
  console.log('\n--- Menu des Paiements ---');
  console.log('1. Lister les paiements');
  console.log('2. Ajouter un paiement');
  console.log('3. Mettre à jour un paiement');
  console.log('4. Supprimer un paiement');
  console.log('0. Retour au menu principal');

  const choice = readlineSync.question('Choisissez une option : ');
  handlePaymentMenu(choice);
}

displayMainMenu();
