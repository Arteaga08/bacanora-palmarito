import express from "express";
const router = express.Router();
import {
  authAdmin,
  registerAdmin,
  getAdminProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

// URLs finales: /api/auth/login y /api/auth/register
router.post("/login", authAdmin);

router.get("/profile", protect, getAdminProfile);

export default router;
