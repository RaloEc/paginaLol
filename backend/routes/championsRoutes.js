const express = require("express");
const Parse = require("parse/node"); // Importa Parse
const router = express.Router();

// Inicializa Parse con tus credenciales (puedes mover esto a un archivo de configuración si lo prefieres)
Parse.initialize(process.env.BACK4APP_APP_ID, process.env.BACK4APP_CLIENT_KEY); // Clave de cliente
Parse.serverURL = "https://parseapi.back4app.com"; // URL de Back4App

// Ruta para obtener los campeones
router.get("/champions", async (req, res) => {
  try {
    const ChampionClass = Parse.Object.extend("Champions"); // Cambia "Champions" al nombre de tu clase
    const query = new Parse.Query(ChampionClass);
    const results = await query.find();

    const championsData = results.map((champion) => ({
      championId: champion.get("championId"),
      championLevel: champion.get("championLevel"),
      championPoints: champion.get("championPoints"),
    }));

    res.status(200).json(championsData);
  } catch (error) {
    console.error("Error al obtener los campeones:", error);
    res.status(500).json({ error: "Error al obtener los campeones" });
  }
});

module.exports = router;
