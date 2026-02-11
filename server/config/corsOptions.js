const whitelist = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, Stripe, mobile apps)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
