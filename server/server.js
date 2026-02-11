import express from "express";
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
import webhookRoutes from "./routes/webhookRoutes.js";

import mongoSanitizeMiddleware from "./middleware/mongoSanitizeMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config();
connectDB();

const app = express();

// --- MIDDLEWARES DE SEGURIDAD ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
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

// 4. MANEJO DE ERRORES
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
