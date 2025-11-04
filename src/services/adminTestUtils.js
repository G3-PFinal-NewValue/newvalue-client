// Utility for testing admin login
import api from "./apiClient";

export const loginAsAdmin = async () => {
  try {
    const response = await api.post("/auth/login", {
      email: "coramind.newvalue@gmail.com",
      password: "admin123",
    });

    if (response.data.token) {
      // Guardar en localStorage como lo hace el servicio de auth normal
      const authData = {
        user: response.data.user,
        token: response.data.token,
      };

      localStorage.setItem("cm_auth", JSON.stringify(authData));
      console.log("Admin login exitoso:", response.data.user);

      // Recargar la página para actualizar el contexto
      window.location.reload();

      return response.data;
    }
  } catch (error) {
    console.error("Error al hacer login como admin:", error);
    throw error;
  }
};

export const checkCurrentUser = () => {
  const authData = localStorage.getItem("cm_auth");
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      console.log("Usuario actual:", parsed.user);
      console.log("Rol actual:", parsed.user?.role);
      return parsed.user;
    } catch (e) {
      console.error("Error parsing auth data:", e);
    }
  }
  return null;
};
