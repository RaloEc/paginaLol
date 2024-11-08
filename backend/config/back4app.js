const Parse = require('parse/node');
require('dotenv').config(); // Cargar las variables de entorno desde el .env

// Inicializar Parse con las credenciales de Back4App
Parse.initialize(process.env.BACK4APP_APP_ID, process.env.BACK4APP_CLIENT_KEY);
Parse.serverURL = 'https://parseapi.back4app.com';

module.exports = Parse;
