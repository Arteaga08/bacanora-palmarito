import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
//Rutas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import mixologyRoutes from "./routes/mixologyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

// 2. FUNDAMENTAL: Debe ir antes de las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. REGISTRO DE RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/mixology", mixologyRoutes);
app.use("/api/upload", uploadRoutes);

// 4. MANEJO DE ERRORES (Al final)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
