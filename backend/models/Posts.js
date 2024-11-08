const Parse = require('parse/node');

// Definir la clase 'Posts', que representa la tabla en la base de datos de Back4App
const Posts = Parse.Object.extend('Posts');

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = Posts;
