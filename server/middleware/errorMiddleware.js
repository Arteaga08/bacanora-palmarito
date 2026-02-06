// Maneja errores de rutas no encontradas (404)
const notFound = (req, res, next) => {
  const error = new Error(`No encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Manejador general de errores
const errorHandler = (err, req, res, next) => {
  // Si el status es 200 pero hubo error, lo forzamos a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    message: err.message,
    // Solo mostramos el stack de error si NO estamos en producción
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
