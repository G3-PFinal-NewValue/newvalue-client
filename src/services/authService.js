import api from "./apiClient";

// Objeto de usuario simulado base
const mockUserBase = {
  id: 1, // ID por defecto
  first_name: "Usuario",
  last_name: "Simulado",
  email: "test@coramind.com",
  role: "patient", // Rol por defecto
};

// Login (simulado con detección de rol por email)
export async function loginRequest({ email, password }) {
  // Lógica simple: si el email contiene 'admin', 'psycho', o nada, asigna rol
  const isAdminLogin = email.toLowerCase().includes('admin');
  const isPsychologistLogin = email.toLowerCase().includes('psycho');
  
  let userRole = 'patient'; // Rol por defecto
  let userId = 101; // ID por defecto para paciente
  let userFirstName = 'Paciente';

  if (isAdminLogin) {
    userRole = 'admin';
    userId = 999;
    userFirstName = 'Admin';
  } else if (isPsychologistLogin) {
    userRole = 'psychologist';
    userId = 102; // ID diferente para psicólogo
    userFirstName = 'Psicólogo';
  }

  const loggedUser = {
    ...mockUserBase,
    email: email, // Usar el email ingresado
    role: userRole, // Asignar rol detectado
    first_name: userFirstName, // Nombre según rol
    id: userId // ID según rol
  };

  const data = {
    token: `mock-token-${loggedUser.role}-${Date.now()}`, // Token simulado
    user: loggedUser,
  };

  // Guardar en localStorage como si el login fuera real
  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  console.log("Mock Login como:", loggedUser.role); // Log para saber como quién entraste
  return data.user; // Devolver solo el objeto usuario
}

// Perfil actual (simulado - lee de localStorage para mantener la sesión simulada)
export async function getMe() {
   const rawAuth = localStorage.getItem("cm_auth");
   if (rawAuth) {
     try {
       const authData = JSON.parse(rawAuth);
       if (authData?.user) {
         console.log("Mock getMe devuelve usuario de localStorage:", authData.user.role);
         // Simulamos una pequeña demora
         await new Promise(resolve => setTimeout(resolve, 100)); 
         return authData.user; 
       }
     } catch(e) { 
        console.error("Error al parsear cm_auth en getMe:", e);
        localStorage.removeItem("cm_auth"); // Limpiar si está corrupto
     }
   }
   // Si no hay nada válido en localStorage, simulamos fallo
   console.log("Mock getMe: No hay usuario válido en localStorage");
   throw new Error("No autenticado (mock)"); // Simular fallo
}

// Register (simulado)
export async function registerRequest({ first_name, last_name, email, password, role, phone_number }) {
  // Creamos un nuevo usuario simulado basado en los datos
  const newUser = {
     ...mockUserBase, 
     first_name, 
     last_name, 
     email, 
     role, 
     id: Date.now() // ID único simple
  };
  const data = { 
    token: `mock-token-${role}-${Date.now()}`, 
    user: newUser 
  };
  // Autologin después de registrar
  localStorage.setItem("cm_auth", JSON.stringify({ token: data.token, user: data.user }));
  console.log("Mock Register como:", newUser.role);
  return data.user;
}

// Logout (simulado - solo limpia localStorage)
export async function logoutRequest() {
  localStorage.removeItem("cm_auth");
  console.log("Mock Logout: Sesión limpiada de localStorage.");
  // No necesitamos llamar a api.post("/auth/logout") en el mock
}