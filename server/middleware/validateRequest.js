// middleware/validateRequest.js
export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues.map((err) => ({
          field: err.path.join("."), // ej: customer.email
          message: err.message,
        })),
      });
    }

    // Reemplazamos con datos validados y normalizados
    req[property] = result.data;
    next();
  };
