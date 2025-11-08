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
        return authData.user;
      }
    } catch (e) {
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

// Login con Google
export async function googleLoginRequest(token) {
  try {
    console.log('Enviando token de Google al backend...');

    const response = await api.post("/auth/google", { token });

    console.log('Respuesta del backend:', response.data);

    const { token: jwt, user } = response.data;

    if (!user) {
      throw new Error('El servidor no devolvió información del usuario');
    }

    if (!jwt) {
      throw new Error('El servidor no devolvió un token válido');
    }

    localStorage.setItem("cm_auth", JSON.stringify({ token: jwt, user }));
    console.log("Login con Google exitoso. Usuario:", user.email, "Rol:", user.role);

    // Devolver el objeto completo con token para que el frontend lo maneje
    return { ...user, token: jwt };
  } catch (error) {
    console.error("Error en googleLoginRequest:", error);

    // Mejorar el mensaje de error
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error?.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido al iniciar sesión con Google');
    }
  }
}
