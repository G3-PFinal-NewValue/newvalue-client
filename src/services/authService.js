import api from "./apiClient";

// Objeto de usuario simulado
const mockUser = {
  id: 1,
  first_name: "Usuario",
  last_name: "Simulado",
  email: "test@coramind.com",
  role: "psychologist", // <-- Importante para que puedas ver la pág. de psicólogo
};

// Login (simulado)
export async function loginRequest({ email, password }) {
  // const { data } = await api.post("/auth/login", { email, password }); // <-- Comentado
  
  // Simulamos una respuesta exitosa
  const data = {
    token: "mock-token-12345",
    user: mockUser,
  };

  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  return data.user;
}

export async function registerRequest({ first_name, last_name, email, password, role, phone_number }) { 
  // const { data } = await api.post("/auth/register", ...); // <-- Comentado
  
  // Simulamos una respuesta
  const data = {
    token: "mock-token-12345",
    user: { ...mockUser, first_name, last_name, email, role },
  };

  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  return data.user;
}

// Perfil actual (simulado)
export async function getMe() {
  // const { data } = await api.get("/auth/me"); // <-- Comentado
  
  // Devolvemos el usuario simulado directamente
  return mockUser;
}

// Logout (solo limpia localStorage)
export async function logoutRequest() {
  localStorage.removeItem("cm_auth");
  // try { await api.post("/auth/logout"); } catch {} // <-- Comentado
}