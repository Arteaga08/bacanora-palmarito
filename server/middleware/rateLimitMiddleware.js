import rateLimit from "express-rate-limit";

// 🛒 Checkout (crear orden / pago)
// Más estricto para evitar bots y fraude
export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,                 // 20 intentos por IP
  message: {
    message: "Demasiados intentos de checkout. Intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔎 Tracking de orden (cliente)
export const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: "Demasiadas consultas de rastreo. Intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
