import axios from "axios";

//solo cambié esto: Mariana
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL,
});


api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("cm_auth");

  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error parsing auth token from localStorage", e);
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const fallback = { message: "Unexpected error" };
    const data = err?.response?.data ?? fallback;
    
    // Manejar errores de autenticación automáticamente
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      console.warn("Token inválido o expirado, limpiando sesión...");
      
      // Limpiar localStorage
      localStorage.removeItem("cm_auth");
      
      // Limpiar header de autorización
      delete api.defaults.headers.common["Authorization"];
      
      // Redirigir al Home solo si no estamos ya en una página pública
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register', '/psychologists', '/blog', '/contacto', '/treatments'];
      
      if (!publicPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/';
      }
    }
    
    return Promise.reject({ status: err?.response?.status, ...data });
  }
);

export default api;