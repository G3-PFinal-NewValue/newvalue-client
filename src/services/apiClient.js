import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("cm_auth");
  
  // AÑADIMOS UN TRY...CATCH
  // Esto evita que la app crashee si 'raw' es un JSON inválido (ej: "undefined" o null)
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Si falla el parseo, simplemente no adjuntes el token
      console.error("Error parsing auth token from localStorage", e);
    }
  }
  return config;
});

// ⬇️ Normaliza errores
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const fallback = { message: "Unexpected error" };
    const data = err?.response?.data ?? fallback;
    return Promise.reject({ status: err?.response?.status, ...data });
  }
);

export default api;