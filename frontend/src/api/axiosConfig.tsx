import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
});

// Intercepteur pour ajouter le token dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Headers envoyés :", config.headers); // ✅ Vérifie ici
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
