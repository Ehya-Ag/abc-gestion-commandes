# ABC Management

## Description
ABC Management est une application de gestion pour suivre les commandes, paiements et produits d'une entreprise. Ce projet est basé sur Node.js et utilise une base de données MySQL.

## Prérequis

Avant de pouvoir lancer l'application, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) (installé avec Node.js)
- [MySQL](https://www.mysql.com/) ou un autre serveur de base de données compatible

## Cloner le projet depuis GitHub

Pour cloner le projet sur votre machine locale, exécutez la commande suivante dans votre terminal :

```git clone https://github.com/Ehya-Ag/abc-management.git```
## Acceder au repertoire
```cd abc-management ```

## Installation des dépendances
Une fois dans le répertoire du projet, installez les dépendances en utilisant npm :

```npm install ```
### Acceder au repertoire src
```cd src ```

## Configuration de la base de données
Exécuter le script SQL pour configurer la base de données :

Un script SQL complet est disponible pour créer la base de données, les tables.
Lien vers le script SQL :

[Lien du script](https://drive.google.com/file/d/1ZmQz6pDXhYYoz8mNivto8cEnDBJMMk6o/view?usp=sharing) 

Telecharger le script.
Pour exécuter le script, utilisez la commande suivante dans votre terminal après avoir configuré MySQL :
```
mysql -u votre_nom_utilisateur -p < Téléchargements/abc_corporation.sql
```
Et si ca marche pas verifier le chemin vers le script telecharger.
```
mysql -u votre_nom_utilisateur -p < chemin/abc_corporation.sql
```

## Configuration du fichier de connection
Configurer la base de données dans l'application :

Ouvrez le fichier config/db.js situé dans le répertoire src.

```cd config```

Modifiez les informations de connexion à la base de données suivant (user, password) avec vos propres paramètres :
```
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'votre_nom_utilisateur',
  password: 'votre_mot_de_passe',
  database: 'abc_corporation',
  connectionLimit: 2,
  connectTimeout: false
});
module.exports = db;
```

Assurez-vous que les informations de connexion sont correctes avant de lancer l'application.

## Lancer l'application
Vous sortez du repertoire config

```cd ..```
Executer l'application

```node index.js ```


## Authors

- [Ehya Ag Mohamed](https://www.github.com/Ehya-Ag)

