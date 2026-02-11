// middleware/errorMiddleware.js

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Sanitización básica del mensaje para evitar inyección de scripts en logs o respuestas
  let message = err.message
    ? String(err.message).replace(/[<>]/g, "")
    : "Error interno del servidor";

  // Error de Mongoose: ObjectId inválido
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Recurso no encontrado (ID inválido)";
  }

  // Error de validación de Mongoose (Importante para trazabilidad de facturación)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Log interno para el desarrollador (No se envía al cliente)
  if (process.env.NODE_ENV !== "production") {
    console.error(`❌ [ERROR]: ${message}`);
  }

  res.status(statusCode).json({
    status: "error",
    message,
    // El stack solo en desarrollo por seguridad y cumplimiento de normativas
    stack: process.env.NODE_ENV === "production" ? "🌵" : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
