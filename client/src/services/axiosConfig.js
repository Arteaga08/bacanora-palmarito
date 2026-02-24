import axios from "axios";

const clientAxios = axios.create({
  // En producción, este "/api" funcionará si el frontend y backend
  // están bajo el mismo dominio. Si no, aquí usarás una variable de entorno.
  baseURL: "/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 1. Interceptor de PETICIÓN (Request)
// Envía el token en cada llamada al servidor
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

// 2. Interceptor de RESPUESTA (Response) 👈 AGREGAR ESTO
// Detecta si la sesión expiró (Error 401)
clientAxios.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, dejarla pasar
  (error) => {
    // Si el error es 401 (No autorizado/Token expirado)
    if (error.response && error.response.status === 401) {
      console.warn("Sesión inválida o expirada. Limpiando credenciales...");

      localStorage.removeItem("userInfo");

      // Redirigir al login solo si no estamos ya en la página de login
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);

export default clientAxios;
