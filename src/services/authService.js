import api from "./apiClient";

// Login
export async function loginRequest({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  // data: { user: {...}, token: "..." }
  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  return data.user;
}

export async function registerRequest({ first_name, last_name, email, password, role, phone_number }) { 
  const { data } = await api.post("/auth/register", { first_name, last_name, email, password, role, phone_number }); 
  // opcional: autologin
  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  return data.user;
}

// Perfil actual
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

// Logout
export async function logoutRequest() {
  localStorage.removeItem("cm_auth");
  try { await api.post("/auth/logout"); } catch {}
}
