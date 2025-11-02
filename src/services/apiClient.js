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
    return Promise.reject({ status: err?.response?.status, ...data });
  }
);

export default api;