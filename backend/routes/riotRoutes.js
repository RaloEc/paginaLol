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
    console.log("Received summonerId:", summonerId);
    console.log("Petición recibida desde frontend, summonerId:", summonerId);
    try {
      const response = await axios.get(
        `https://la1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Error al obtener la división:",
        error.response ? error.response.data : error.message
      );
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

// Ruta para obtener el historial de partidas usando el PUUID
router.get("/lol/match/v5/matches/by-puuid/:puuid/ids", async (req, res) => {
  const { puuid } = req.params;
  const { start = 0, count = 2 } = req.query; // Se pueden agregar parámetros para limitar la cantidad de partidas y la paginación

  try {
    console.log(`Obteniendo historial de partidas para PUUID: ${puuid}`); // Verificar si se alcanza la ruta
    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${RIOT_API_KEY}`
    );
    console.log("Historial de partidas obtenido:", response.data); // Mostrar los datos obtenidos
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error(
        "Error al obtener el historial de partidas:",
        error.response.status,
        error.response.data
      );
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error("Error desconocido:", error.message);
      res.status(500).json({ error: "Error al comunicarse con Riot API" });
    }
  }
});

// Obtener detalles de una partida por matchId
router.get("/lol/match/v5/matches/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      `Error al obtener los detalles de la partida ${matchId}:`,
      error
    );
    res.status(500).json({
      error: `No se pudieron obtener los detalles de la partida ${matchId}`,
    });
  }
});

// Ruta para verificar si el invocador está en partida
router.get(
  "/lol/spectator/v5/active-games/by-summoner/:encryptedPUUID",
  async (req, res) => {
    console.log("Ruta alcanzada"); // Verificar si se alcanza la ruta
    const { encryptedPUUID } = req.params;

    try {
      const response = await axios.get(
        `https://la1.api.riotgames.com/riot/lol/spectator/v5/active-games/by-summoner/${encryptedPUUID}?api_key=${process.env.RIOT_API_KEY}`
      );

      // Mostrar toda la respuesta de la API de Riot
      console.log("Respuesta completa de Riot API:", response.data);

      // Si la respuesta tiene datos, significa que el jugador está en partida
      if (response.data && response.data.gameId) {
        res.json(response.data); // Devuelve los datos de la partida
      } else {
        res.status(404).json({ message: "No estás en partida." });
      }
    } catch (error) {
      // Verificar si es un error 404 u otro error
      if (error.response) {
        console.log(
          "Error de Riot API:",
          error.response.status,
          error.response.data
        );
        if (error.response.status === 404) {
          return res.status(404).json({ message: "No estás en partida." });
        }
      } else {
        console.error("Error desconocido:", error.message);
        res.status(500).json({ error: "Error al comunicarse con Riot API" });
      }
    }
  }
);

module.exports = router; // Asegúrate de exportar el router
