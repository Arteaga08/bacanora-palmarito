import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Esta ruta será: /api/webhooks/stripe
router.post("/stripe", handleStripeWebhook);

export default router;
