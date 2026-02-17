import axios from "axios";

const clientAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5008/api",
});

export default clientAxios;
