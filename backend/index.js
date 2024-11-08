const express = require("express");
const cors = require("cors");
const ParseServer = require("parse-server").ParseServer;
const dotenv = require("dotenv");
const riotRoutes = require("./routes/riotRoutes");
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const port = 3001; // El puerto donde correrá el backend
const axios = require("axios");
const championRoutes = require("./routes/championsRoutes"); // Importa la nueva ruta
const postRoutes = require("./routes/postRoutes");

dotenv.config();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://192.168.100.56:3000",
    ], // Asegúrate de incluir los orígenes correctos
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permitir todos los métodos relevantes
  })
);
app.options("*", cors()); // Permite todas las solicitudes de tipo OPTIONS para todas las rutas


app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next();
});

// Rutas
app.use("/api", postRoutes);
app.use("/api", championRoutes); // Agrega esta línea
app.use("/riot", riotRoutes);

// Ruta básica para verificar si el servidor está corriendo
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente.");
});


// Inicializa el servidor Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://192.168.100.56:3000",
    ], // Dirección de tu frontend en React
    methods: ["GET", "POST"],
  },
});

// Conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("start-checking-game", async (summonerId) => {
    const intervalId = setInterval(async () => {
      const activeGame = await checkActiveGame(summonerId);
      if (activeGame) {
        // Si el usuario está en partida, emite un evento
        socket.emit("game-started", activeGame);
      }
    }, 5000); // Verificar cada 5 segundos

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
      clearInterval(intervalId);
    });
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
