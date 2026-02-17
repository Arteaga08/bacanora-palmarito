import AdminUser from "../models/AdminUser.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// 1. Asegúrate de que tenga "export" al inicio
export const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 🕵️ LOG 1: ¿Qué está llegando del frontend?
  console.log("1. Body recibido:", req.body);

  // Verificamos que no vengan vacíos
  if (!email || !password) {
    res.status(400);
    throw new Error("Faltan email o password");
  }

  const user = await AdminUser.findOne({ email });

  // 🕵️ LOG 2: ¿Encontró al usuario en Mongo?
  console.log("2. Usuario encontrado:", user ? user.email : "NO EXISTE");

  if (user && (await user.matchPassword(password))) {
    // 🕵️ LOG 3: Contraseña correcta, generando token...
    console.log("3. Login exitoso, enviando respuesta");

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      }),
    });
  } else {
    console.log("4. Contraseña incorrecta o usuario no existe");
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// 2. Asegúrate de que esta también tenga "export"
export const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await AdminUser.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Admin ya existe");
  }

  const user = await AdminUser.create({ username, email, password });
  res.status(201).json({
    _id: user._id,
    username: user.username,
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }),
  });
});

// 3. Y esta también
export const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
