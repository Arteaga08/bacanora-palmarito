import express from "express";
import {
  authAdmin,
  registerAdmin,
  getAdminProfile,
} from "../controllers/authController.js";
// 👇 IMPORTANTE: Traemos los "cadeneros" (middlewares)
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. LOGIN (PÚBLICA): Esta SIEMPRE debe ser pública para poder entrar
router.post("/login", authAdmin);

// 2. REGISTER (PROTEGIDA): Solo un admin logueado puede crear otro admin
// 🔒 Agregamos 'protect' y 'admin' antes del controlador
router.post("/register", protect, admin, registerAdmin);

// 3. PERFIL (PROTEGIDA)
router.get("/profile", protect, getAdminProfile);

export default router;
