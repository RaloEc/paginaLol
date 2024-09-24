const express = require("express");
const axios = require("axios");
const router = express.Router();
const cors = require("cors");
const dotenv = require("dotenv"); // Requiere dotenv para usar las variables del .env
dotenv.config(); // Carga las variables del archivo .env

// Configura tu API Key de Riot aquí
const RIOT_API_KEY = process.env.RIOT_API_KEY; // Accede a la variable de entorno

// Ruta para obtener el PUUID basado en gameName y tagLine
router.get(
  "/account/v1/accounts/by-riot-id/:gameName/:tagLine",
  async (req, res) => {
    const { gameName, tagLine } = req.params;

    try {
      const response = await axios.get(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${RIOT_API_KEY}`
      );
      console.log("Respuesta de Riot API:", response.data); // <-- Agrega esto para ver qué devuelve Riot
      res.json(response.data);
    } catch (error) {
      console.error("Error al obtener el PUUID:", error);
      res.status(500).json({ error: "Error al comunicarse con Riot API" });
    }
  }
);

// Ruta para obtener la información de campeones usando el PUUID
router.get(
  "/lol/champion-mastery/v4/champion-masteries/by-puuid/:puuid/top",
  async (req, res) => {
    const { puuid } = req.params;

    try {
      const response = await axios.get(
        `https://la1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?api_key=${RIOT_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Error al obtener la información de campeones:",
        error.message
      );
      res.status(500).json({ error: "Error al comunicarse con Riot API" });
    }
  }
);

// Ruta para obtener la información del invocador (icono y nivel) usando el PUUID
router.get("/lol/summoner/v4/summoners/by-puuid/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    const response = await axios.get(
      `https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener la información del invocador:", error);
    res.status(500).json({ error: "Error al comunicarse con Riot API" });
  }
});

// Ruta para obtener la división (rank) usando el encryptedSummonerId
router.get(
  "/lol/league/v4/entries/by-summoner/:summonerId",
  async (req, res) => {
    const { summonerId } = req.params;

    try {
      const response = await axios.get(
        `https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error al obtener la división:", error);
      res.status(500).json({ error: "Error al comunicarse con Riot API" });
    }
  }
);

// Nueva ruta para obtener el encryptedSummonerId usando el puuid
router.get("/lol/summoner/v4/summoners/by-puuid/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    const response = await axios.get(
      `https://la1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
    );

    // Muestra el id y accountId en la consola
    console.log("ID:", response.data.id);
    console.log("Account ID:", response.data.accountId);

    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener el summonerId:", error);
    res.status(500).json({ error: "Error al comunicarse con Riot API" });
  }
});

router.get("/riot/endpoint", async (req, res) => {
  try {
    const response = await axios.get("URL_A_RIOT_API");
    res.json(response.data); // Enviar JSON
  } catch (error) {
    console.error("Error al obtener datos de Riot:", error);
    res.status(500).json({ error: "Error al comunicarse con Riot API" });
  }
});

module.exports = router;
