import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setBooting(false); return; }
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally { setBooting(false); }
    })();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  if (booting) return null; // evita parpadeo

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
