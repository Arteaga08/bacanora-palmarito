import express from "express";
const router = express.Router();

/* Controllers */
import {
  addOrderItems,
  getOrders,
  getOrderById,
  getOrderByOrderNumber,
} from "../controllers/orderController.js";

/* Middlewares */
import { validate } from "../middleware/validateRequest.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  trackLimiter,
  checkoutLimiter,
} from "../middleware/rateLimitMiddleware.js";

/* Validators */
import { orderSchema } from "../validator/orderValidator.js";
import { trackOrderSchema } from "../validator/trackOrderValidator.js";

/* 
 CHECKOUT
   POST /api/orders */
router
  .route("/")
  .post(checkoutLimiter, validate(orderSchema), addOrderItems)
  .get(protect, admin, getOrders);

/* TRACKING CLIENTE
   POST /api/orders/track */
router.post(
  "/track",
  trackLimiter,
  validate(trackOrderSchema),
  getOrderByOrderNumber,
);

/* ORDEN POR ID (ADMIN)
   GET /api/orders/:id */
router.get("/:id", protect, admin, getOrderById);

export default router;
