import asyncHandler from "express-async-handler";
import Mixology from "../models/Mixology.js";

// @desc    Obtener todas las recetas
// Public
export const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Mixology.find({});
  res.json(recipes);
});

// @desc    Crear receta 
//Admin
export const createRecipe = asyncHandler(async (req, res) => {
  const { name, slug, ingredients, preparation } = req.body;

  const recipe = new Mixology({
    user: req.user._id,
    name,
    slug,
    // Extraemos la URL de Cloudinary procesada por el middleware upload.single('image')
    image: req.file ? req.file.path : "/images/sample-cocktail.jpg",
    // IMPORTANTE: En form-data los arrays llegan como string, hay que parsearlos
    ingredients: ingredients ? JSON.parse(ingredients) : [],
    preparation,
  });

  const createdRecipe = await recipe.save();
  res.status(201).json(createdRecipe);
});

// @desc    Actualizar receta
//Admin
export const updateRecipe = asyncHandler(async (req, res) => {
  const { name, slug, ingredients, preparation } = req.body;
  const recipe = await Mixology.findById(req.params.id);

  if (recipe) {
    recipe.name = name || recipe.name;
    recipe.slug = slug || recipe.slug;
    recipe.preparation = preparation || recipe.preparation;

    // Si el admin subió una nueva imagen, actualizamos la URL
    if (req.file) {
      recipe.image = req.file.path;
    }

    // Si vienen nuevos ingredientes, los parseamos
    if (ingredients) {
      recipe.ingredients = JSON.parse(ingredients);
    }

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404);
    throw new Error("Receta no encontrada");
  }
});

// @desc    Eliminar 
//Admin
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Mixology.findById(req.params.id);
  if (recipe) {
    await recipe.deleteOne();
    res.json({ message: "Receta eliminada" });
  } else {
    res.status(404);
    throw new Error("Receta no encontrada");
  }
});

// @desc    Obtener receta por ID
//Public
export const getMixologyById = asyncHandler(async (req, res) => {
  const recipe = await Mixology.findById(req.params.id);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404);
    throw new Error("Receta no encontrada");
  }
});