const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitize(obj[key]);
    }
  }
  return obj;
};

const mongoSanitizeMiddleware = (req, res, next) => {
  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query);
  next();
};

export default mongoSanitizeMiddleware;
