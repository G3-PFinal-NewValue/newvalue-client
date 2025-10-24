import api from "./apiClient";

// Login
export async function loginRequest({ email, password }) {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    localStorage.setItem("cm_auth", JSON.stringify({ token, user }));
    console.log("Login exitoso. Usuario:", user.role);

    return user; 
  } catch (error) {
    console.error("Error en loginRequest:", error);
    
    throw error;
  }
}

// Register
export async function registerRequest(userData) {
  try {

    const response = await api.post("/auth/register", userData);
    const { token, user } = response.data; 
    localStorage.setItem("cm_auth", JSON.stringify({ token, user }));
    console.log("Registro exitoso. Usuario:", user.role);
    return user; 
  } catch (error) {
    console.error("Error en registerRequest:", error);
    // Relanzar el error
    throw error;
  }
}

export async function getMe() {
   const rawAuth = localStorage.getItem("cm_auth");
   if (rawAuth) {
     try {
       const authData = JSON.parse(rawAuth);
       if (authData?.user) {
         console.log("getMe devuelve usuario de localStorage:", authData.user.role);
         // Podrías añadir una verificación del token aquí si quieres
         return authData.user;
       }
     } catch(e) {
        console.error("Error al parsear cm_auth en getMe:", e);
        localStorage.removeItem("cm_auth");
     }
   }
   console.log("getMe: No hay usuario válido en localStorage");
   throw new Error("No autenticado");
}


export async function logoutRequest() {
  localStorage.removeItem("cm_auth");
  console.log("Logout: Sesión limpiada de localStorage.");

}