import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";

// @desc    Obtener todos los productos
//Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Crear un producto
//Admin
export const createProduct = asyncHandler(async (req, res) => {
  console.log("--- Iniciando Creación de Producto ---");
  console.log("Cuerpo (req.body):", req.body);
  console.log("Archivos (req.files):", req.files);

  try {
    const {
      name,
      price,
      description,
      category,
      countInStock,
      slug,
      ingredients,
    } = req.body;

    // Validación ultra-segura de imágenes
    const images = {
      cardPrimary:
        req.files && req.files["imagePrimary"]
          ? req.files["imagePrimary"][0].path
          : "/images/sample.jpg",
      cardHover:
        req.files && req.files["imageHover"]
          ? req.files["imageHover"][0].path
          : "/images/sample.jpg",
      displayDetail:
        req.files && req.files["imageDetail"]
          ? req.files["imageDetail"][0].path
          : "/images/sample.jpg",
    };

    const product = new Product({
      user: req.user._id,
      name: name || "Nuevo Producto",
      slug: slug || `producto-${Date.now()}`,
      images,
      category: category || "Bacanora",
      description: description || "Sin descripción",
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      price: price || 0,
      countInStock: countInStock || 0,
      isAvailable: true,
    });

    const createdProduct = await product.save();
    console.log("✅ Producto creado con éxito");
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ ERROR EN CREATE PRODUCT:", error.message);
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc    Actualizar un producto
//Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    countInStock,
    isAvailable,
    ingredients,
    slug,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // 🕵️‍♂️ CAPTURE PREVIOUS STATE (Before mutation)
    const previousState = {
      price: product.price,
      countInStock: product.countInStock,
      isAvailable: product.isAvailable,
    };

    // Images logic
    if (req.files) {
      if (req.files["imagePrimary"])
        product.images.cardPrimary = req.files["imagePrimary"][0].path;
      if (req.files["imageHover"])
        product.images.cardHover = req.files["imageHover"][0].path;
      if (req.files["imageDetail"])
        product.images.displayDetail = req.files["imageDetail"][0].path;
    }

    // Update fields
    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.countInStock =
      countInStock !== undefined ? countInStock : product.countInStock;
    product.isAvailable =
      isAvailable !== undefined ? isAvailable : product.isAvailable;

    if (ingredients) product.ingredients = JSON.parse(ingredients);

    const updatedProduct = await product.save();

    // 📝 CREATE AUDIT LOG
    await AuditLog.create({
      adminId: req.user._id,
      action: "UPDATE_PRODUCT",
      module: "Inventory",
      targetId: product._id.toString(),
      details: {
        productName: product.name,
        from: previousState,
        to: {
          price: updatedProduct.price,
          countInStock: updatedProduct.countInStock,
          isAvailable: updatedProduct.isAvailable,
        },
      },
      ip: req.ip,
    });

    console.log(
      `✅ Audit Log: Product ${product.name} updated by ${req.user.email}`,
    );

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Eliminar un producto
//Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Producto eliminado correctamente" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Obtener producto por ID
//Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});
