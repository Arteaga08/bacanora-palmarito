import express from "express";
const router = express.Router();
import { updateTracking } from "../controllers/shippingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.patch("/update-guide/:orderNumber", protect, admin, updateTracking);

export default router;
