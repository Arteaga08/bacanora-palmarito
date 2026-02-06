import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'palmarito_assets',
    format: async (req, file) => 'webp', // Opcional: Esto convierte CUALQUIER cosa a webp automáticamente
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'avif'], // <--- Asegúrate de que esté DENTRO de params
  },
});

const upload = multer({ storage });

export default upload;
