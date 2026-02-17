import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  archiveProduct,
  updateProductStock,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

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
  .get(getProductById)
  .put(protect, admin, productUpload, updateProduct)
  .delete(protect, admin, deleteProduct);

router.put("/:id/archive", protect, admin, archiveProduct);

router.put("/:id/stock", protect, admin, updateProductStock);

export default router;
