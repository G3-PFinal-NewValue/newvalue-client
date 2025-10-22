import { createContext, useContext, useEffect, useState } from "react";
// 👇 Importamos el servicio de logout (que ahora está simulado)
import { logoutRequest } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // useEffect SIMPLIFICADO para mocks
  useEffect(() => {
    // 1. Buscar la clave "cm_auth"
    const rawAuth = localStorage.getItem("cm_auth");
    
    if (rawAuth) {
      try {
        // 2. Si existe, confiamos en el usuario guardado
        const authData = JSON.parse(rawAuth);
        if (authData?.user) {
          setUser(authData.user);
        }
      } catch (e) {
        // Si está corrupto, lo limpiamos
        localStorage.removeItem("cm_auth");
      }
    }
    // 3. Dejamos de "bootear"
    setBooting(false);
  }, []); // Se ejecuta solo una vez al cargar la app

  const login = (userData) => {
    setUser(userData);
    // El servicio loginRequest (ahora simulado) ya guardó en localStorage
  };
  
  const logout = async () => {
    await logoutRequest(); // Llama al servicio simulado (que limpia localStorage)
    setUser(null); // Quita el usuario del estado
  };

  if (booting) return null; // evita parpadeo

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);