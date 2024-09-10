const readline = require('readline');
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('./customerModule');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\n--- Menu ---');
  console.log('1. Liste des clients');
  console.log('2. Ajouter des clients');
  console.log('3. Mettre à jour un client');
  console.log('4. Supprimer un client');
  console.log('0. Quitter');
}


function handleChoice(choice) {
  switch (choice) {
    case '1': 
      getCustomers()
        .then((customers) => {
          console.log('\n--- Customer List ---');
          customers.forEach(customer => {
            console.log(`ID: ${customer.id}, Name: ${customer.name}, Address: ${customer.address}, Email: ${customer.email}, Phone: ${customer.phone}`);
          });
          displayMenu();
        })
        .catch((err) => console.error(err));
      break;

    case '2':
      rl.question('Customer name: ', (name) => {
        rl.question('Address: ', (address) => {
          rl.question('Email: ', (email) => {
            rl.question('Phone: ', (phone) => {
              addCustomer(name, address, email, phone)
                .then(() => {
                  console.log('Customer added successfully.');
                  displayMenu();
                })
                .catch((err) => console.error(err));
            });
          });
        });
      });
      break;

    case '3':
      rl.question('Customer ID to update: ', (id) => {
        rl.question('New name: ', (name) => {
          rl.question('New address: ', (address) => {
            rl.question('New email: ', (email) => {
              rl.question('New phone: ', (phone) => {
                updateCustomer(id, name, address, email, phone)
                  .then(() => {
                    console.log('Customer updated successfully.');
                    displayMenu();
                  })
                  .catch((err) => console.error('Error:', err.message));
              });
            });
          });
        });
      });
      break;

    case '4': 
      rl.question('Customer ID to delete: ', (id) => {
        deleteCustomer(id)
          .then(() => {
            console.log('Customer deleted successfully.');
            displayMenu();
          })
          .catch((err) => console.error('Error:', err.message));
      });
      break;

    case '0': 
      console.log('Goodbye!');
      rl.close();
      break;

    default:
      console.log('Invalid choice, please try again.');
      displayMenu();
  }
}

// Menu
rl.on('line', (input) => {
  handleChoice(input.trim());
});

displayMenu();
