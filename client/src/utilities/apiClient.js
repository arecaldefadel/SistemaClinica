import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Opcional: Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
  }
);

export default api;
