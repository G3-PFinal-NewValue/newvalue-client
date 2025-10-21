import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ⬇️ Adjunta token si usáis JWT
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("cm_auth");
  if (raw) {
    const { token } = JSON.parse(raw);
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
