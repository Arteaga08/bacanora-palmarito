import express from "express";
import upload from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Usamos upload.single('image') porque 'image' será el nombre del campo en Postman
router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: "Imagen subida con éxito",
      url: req.file.path,
      public_id: req.file.filename,
    });
  } else {
    res.status(400);
    throw new Error("No se pudo subir la imagen");
  }
});

export default router;
