import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import AdminUser from "../models/AdminUser.js";

// 1. Proteger rutas (Verificar Token)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // El token viene como "Bearer eyJhbGciOi..." -> sacamos la segunda parte
      token = req.headers.authorization.split(" ")[1];

      // Decodificamos
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario por ID y lo guardamos en req.user (sin el password)
      req.user = await AdminUser.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("No autorizado, token fallido");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

// 2. Verificar Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401);
    throw new Error("No autorizado como admin");
  }
};

export { protect, admin };
