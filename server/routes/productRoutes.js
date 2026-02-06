import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// 1. IMPORTA TU CONFIGURACIÓN DE CLOUDINARY
import upload from "../config/cloudinary.js";

const router = express.Router();

// 2. DEFINE LOS CAMPOS (Esto ya lo tenías bien pensado)
const productUpload = upload.fields([
  { name: "imagePrimary", maxCount: 1 },
  { name: "imageHover", maxCount: 1 },
  { name: "imageDetail", maxCount: 1 },
]);

// 3. APLICA EL MIDDLEWARE EN EL .post()
// Importante: El orden es protect -> admin -> productUpload -> createProduct
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, productUpload, createProduct);

router
  .route("/:id")
  .get(getProductById) // <--- ESTA ES LA NUEVA
  .put(protect, admin, productUpload, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
