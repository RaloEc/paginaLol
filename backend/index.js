const express = require("express");
const cors = require("cors");
const ParseServer = require("parse-server").ParseServer;
const dotenv = require("dotenv");
const riotRoutes = require("./routes/riotRoutes");
const app = express();

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const port = 3001; // El puerto donde correrá el backend


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'], // Asegúrate de incluir los orígenes correctos
    methods: ['GET', 'POST']
  }));
app.use(express.json());
app.use("/riot", riotRoutes);
// Ruta básica para verificar si el servidor está corriendo
app.get('/', (req, res) => {
    res.send('Backend funcionando correctamente.');
  });

dotenv.config();


const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3002'], // Dirección de tu frontend en React
      methods: ['GET', 'POST']
    }
  });
// Socket.IO para manejar las conexiones
io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Configura el Parse Server con tus credenciales de Back4App
const api = new ParseServer({
  databaseURI:
    "mongodb://admin:BXepSHZVMWXCes5c1RF9vRkw@MongoS3601A.back4app.com:27017/81818a0e17164181ba86d7abc12dd4f2", // Back4App te provee esta URI
  cloud: "./cloud/main.js", // Cloud Code file
  appId: process.env.BACK4APP_APP_ID,
  masterKey: process.env.BACK4APP_MASTER_KEY,
  serverURL: "https://parseapi.back4app.com",
  clientKey: process.env.BACK4APP_CLIENT_KEY,
});

// Inicia el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
