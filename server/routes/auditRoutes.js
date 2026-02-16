import express from "express";
const router = express.Router();
import { getAuditLogs } from "../controllers/auditController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/", protect, admin, getAuditLogs);

export default router;
