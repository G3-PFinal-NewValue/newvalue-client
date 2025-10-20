import api from "./apiClient";

// ⚠️ Stubs: dejarán token en localStorage pero NO llaman backend aún.
export async function loginRequest({ email, password }) {
  // TODO: reemplazar por api.post("/auth/login", { email, password })
  const mockUser = { id: 1, name: "Camila", email, role: "patient" };
  const mockToken = "dev-token";
  localStorage.setItem("token", mockToken);
  return mockUser;
}

export async function registerRequest(payload) {
  // TODO: reemplazar por api.post("/auth/register", payload)
  const mockUser = { id: 2, name: payload.name, email: payload.email, role: payload.role };
  const mockToken = "dev-token";
  localStorage.setItem("token", mockToken);
  return mockUser;
}

export async function getMe() {
  // TODO: reemplazar por api.get("/auth/me")
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return { id: 1, name: "Camila", email: "me@example.com", role: "patient" };
}
