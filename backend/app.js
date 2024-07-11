const express = require('express');
const app = express();
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');


// Charger les variables d'environnement
const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose');

// Récupérer les informations de connexion depuis les variables d'environnement
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD; 
const cluster = process.env.MONGODB_CLUSTER;

// Construire l'URI de connexion
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0`;


// Connexion à MongoDB avec Mongoose
mongoose.connect(uri)
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content, Accept, Content-Type, Authorization' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;