// backend/routes/postRoutes.js
const express = require("express");
const multer = require("multer");
const { Posts } = require("../models/Posts"); // Modelo de Back4App
const { Parse } = require("../config/back4app"); // Asegúrate de tener Parse configurado
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Subir archivos a carpeta temporal

// Ruta para crear una publicación
router.post(
  "/create-post",
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);

      const { postText, match, userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID es requerido" });
      }

      // Crear una nueva instancia del modelo de publicación
      const newPost = new Posts();
      newPost.set("userID", userId);
      newPost.set("postText", postText);

      // Manejo de la imagen, si fue subida
      if (req.files["image"]) {
        const imagePath = req.files["image"][0].path;
        const imageFile = new Parse.File(req.files["image"][0].originalname, {
          base64: fs.readFileSync(imagePath, { encoding: "base64" }),
        });
        newPost.set("image", imageFile);
      }

      // Manejo del video, si fue subido
      if (req.files["video"]) {
        const videoPath = req.files["video"][0].path;
        const videoFile = new Parse.File(req.files["video"][0].originalname, {
          base64: fs.readFileSync(videoPath, { encoding: "base64" }),
        });
        newPost.set("video", videoFile);
      }

      // Si el usuario seleccionó una partida del historial, guardarla
      newPost.set("matchID", match || null);

      // Guardar la publicación en Back4App
      await newPost.save();

      // Eliminar archivos temporales
      if (req.files["image"]) fs.unlinkSync(req.files["image"][0].path);
      if (req.files["video"]) fs.unlinkSync(req.files["video"][0].path);

      // Responder al cliente
      res.status(201).json({ message: "Publicación creada exitosamente" });
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      res.status(500).json({ error: "Error al crear la publicación" });
    }
  }
);
router.get("/api/test", (req, res) => {
  res.status(200).send("Ruta de prueba funcionando");
});
module.exports = router;
