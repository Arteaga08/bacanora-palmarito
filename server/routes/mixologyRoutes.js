import express from "express";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMixologyById,
} from "../controllers/mixologyController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// 1. Importar el config de Cloudinary
import upload from "../config/cloudinary.js";

const router = express.Router();

// 2. Aplicar upload.single('image') en el POST y el PUT
router
  .route("/")
  .get(getRecipes)
  .post(protect, admin, upload.single("image"), createRecipe);

router
  .route("/:id")
  .get(getMixologyById)
  .put(protect, admin, upload.single("image"), updateRecipe)
  .delete(protect, admin, deleteRecipe);

export default router;
