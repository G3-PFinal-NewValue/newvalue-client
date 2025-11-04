import { createContext, useContext, useEffect, useState } from "react";
import { logoutRequest } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const rawAuth = localStorage.getItem("cm_auth");
    if (rawAuth) {
      try {
        const authData = JSON.parse(rawAuth);
        if (authData?.user && authData?.token) {
          setUser(authData.user);
          setToken(authData.token);
        }
      } catch (e) {
        console.error("Error leyendo cm_auth:", e);
        localStorage.removeItem("cm_auth");
      }
    }
    setBooting(false);
  }, []);

  const login = (authData) => {
    if (!authData?.user || !authData?.token) return;
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem("cm_auth", JSON.stringify(authData));
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setToken(null);
    localStorage.removeItem("cm_auth");
  };

  const getToken = () => token;

  if (booting) return <p>Cargando usuario...</p>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};