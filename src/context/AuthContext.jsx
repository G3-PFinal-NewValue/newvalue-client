import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

// ... (imports)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // 1. Buscar la clave correcta: "cm_auth"
    const rawAuth = localStorage.getItem("cm_auth");
    if (!rawAuth) {
      setBooting(false);
      return;
    }

    // 2. Parsear el JSON y extraer el token
    let token;
    try {
      const authData = JSON.parse(rawAuth);
      token = authData?.token;
    } catch (e) {
      token = null;
    }

    // 3. Validar que el token exista
    if (!token) {
      setBooting(false);
      return;
    }

    (async () => {
      try {
        // getMe() ya usa el token gracias al apiClient
        const me = await getMe();
        setUser(me);
      } catch {
        // 4. Limpiar la clave correcta en caso de error
        localStorage.removeItem("cm_auth");
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = (userData) => setUser(userData);
  
  // 5. Asegurarse que logout elimine la clave correcta
  const logout = () => { localStorage.removeItem("cm_auth"); setUser(null); };

  if (booting) return null; // evita parpadeo

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
