import dotenv from "dotenv";

// Aseguramos que las variables estén cargadas si este archivo se llama independientemente
dotenv.config();

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Leemos la whitelist DENTRO de la función (Runtime)
    // Esto garantiza que process.env ya tiene los valores cargados
    const whitelist = process.env.CORS_WHITELIST
      ? process.env.CORS_WHITELIST.split(",").map((item) => item.trim())
      : [];

    // 2. Logs para depuración profesional (Verás esto en tu terminal si falla)
    if (process.env.NODE_ENV === "development") {
      // console.log(`📡 Request Origin: ${origin}`);
      // console.log(`📋 Whitelist actual: ${whitelist}`);
    }

    // 3. Validación estricta
    // !origin permite Postman y llamadas Server-to-Server
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`🚫 Bloqueado por CORS: ${origin}`);
      callback(new Error("No permitido por CORS - Origen no reconocido"));
    }
  },
  credentials: true, // Permite enviar cookies/tokens
  optionsSuccessStatus: 200,
};

export default corsOptions;
