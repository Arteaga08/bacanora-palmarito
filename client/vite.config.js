import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 🚀 Redirecciona las peticiones de API al servidor de Express
      "/api": {
        target: "http://localhost:5008",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
