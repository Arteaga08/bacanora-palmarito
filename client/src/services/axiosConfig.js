import axios from "axios";

const clientAxios = axios.create({
  // 🚨 CAMBIO CLAVE: Usamos solo "/api"
  // Al no poner "http://localhost:5008", Vite atrapa la petición y la redirige.
  baseURL: "/api",

  headers: {
    "Content-Type": "application/json",
  },
  // Esto ayuda a que las cookies (si usaras) viajen bien
  withCredentials: true,
});

// Interceptor para agregar el Token automáticamente
clientAxios.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default clientAxios;
