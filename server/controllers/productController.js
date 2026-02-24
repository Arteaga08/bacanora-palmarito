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
      volume, // 👈 Extraemos el volumen
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
      volume: volume || "750 ML", // 👈 Lo guardamos (con default a 750 ML)
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
    volume, // 👈 Extraemos el volumen
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
    product.volume = volume || product.volume; // 👈 Lo actualizamos si viene en el body

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
    const productName = product.name;

    await product.deleteOne();

    // 📝 REGISTRO EN AUDITORÍA
    await AuditLog.create({
      adminId: req.user._id,
      action: "DELETE_PRODUCT",
      module: "Inventory",
      targetId: req.params.id,
      details: {
        productName: productName,
        message: "Producto eliminado definitivamente del catálogo",
      },
      ip: req.ip,
    });

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

// @desc    Actualizar únicamente el stock (Inventario Rápido)
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = asyncHandler(async (req, res) => {
  const { countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const previousStock = product.countInStock;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    // 📝 Auditoría específica para movimiento de inventario
    await AuditLog.create({
      adminId: req.user._id,
      action: "UPDATE_INVENTORY",
      module: "Inventory",
      targetId: product._id.toString(),
      details: {
        productName: product.name,
        from: { countInStock: previousStock },
        to: { countInStock: updatedProduct.countInStock },
      },
      ip: req.ip,
    });

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// @desc    Archivar producto (Soft Delete)
// @route   PUT /api/products/:id/archive
// @access  Private/Admin
export const archiveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isActive = false;
    const archivedProduct = await product.save();

    // 📝 REGISTRO EN AUDITORÍA
    if (global.AuditLog) {
      await AuditLog.create({
        adminId: req.user._id,
        action: "ARCHIVE_PRODUCT",
        module: "Inventory",
        targetId: product._id,
        details: {
          productName: product.name,
          message: "Producto retirado del catálogo activo (Soft Delete)",
        },
        ip: req.ip,
      });
    }

    res.json({
      message: "Producto archivado correctamente",
      product: archivedProduct,
    });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});
