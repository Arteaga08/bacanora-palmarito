import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import cors from "cors";
import helmet from "helmet";
import corsOptions from "./config/corsOptions.js";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import mixologyRoutes from "./routes/mixologyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";

import mongoSanitizeMiddleware from "./middleware/mongoSanitizeMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(compression());
app.set("trust proxy", 1);
// --- MIDDLEWARES DE SEGURIDAD ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://res.cloudinary.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc:
          process.env.NODE_ENV === "production"
            ? ["'self'", "https://res.cloudinary.com"]
            : ["'self'", "https://res.cloudinary.com", "http://localhost:5008"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
      },
    },
    ...(process.env.NODE_ENV === "production" && {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
    xFrameOptions: { action: "deny" },
  }),
);
app.use(cors(corsOptions));
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);

// --- MIDDLEWARES GLOBALES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 🛡️ SANITIZACIÓN MONGODB */
app.use(mongoSanitizeMiddleware);

// 3. REGISTRO DE RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/mixology", mixologyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/audit", auditRoutes);
app.use("/sitemap.xml", sitemapRoutes);

// 4. MANEJO DE ERRORES
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
