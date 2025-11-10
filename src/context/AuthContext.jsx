import { createContext, useContext, useEffect, useState } from "react";
import { logoutRequest } from "../services/authService";
import { CometChat } from '@cometchat/chat-sdk-javascript';
import apiClient from '../services/apiClient';

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
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
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

  const login = async (authData) => {
    if (!authData?.user || !authData?.token) return;
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem("cm_auth", JSON.stringify(authData));

    try {
      // 2a. Configurar apiClient con el NUEVO token
      // (Crítico para que la siguiente llamada funcione)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;

      // 2b. Pedir el token de CometChat a NUESTRO backend
      // (Usa el endpoint /api/chat/token que creamos)
      const chatTokenResponse = await apiClient.get('/api/chat/token');
      const { authToken } = chatTokenResponse.data;

      // 2c. Iniciar sesión en CometChat
      const loggedInUser = await CometChat.login(authToken);
      console.log('Inicio de sesión en CometChat exitoso:', loggedInUser.getName());

    } catch (chatError) {
      console.error('Error al iniciar sesión en CometChat:', chatError);
      // No fallar el login principal, pero registrar el error
    }
  };

const logout = async () => {
    try {
      // --- LÓGICA DE COMETCHAT AÑADIDA (antes de limpiar) ---
      await CometChat.logout();
      console.log('Sesión de CometChat cerrada');
      // --- FIN DE LÓGICA AÑADIDA ---
      
      await logoutRequest(); // Tu logout del backend
    
    } catch (error) {
      console.error("Error durante el logout:", error);
    
    } finally {
      // Esto se ejecuta siempre, incluso si hay error
      setUser(null);
      setToken(null);
      localStorage.removeItem("cm_auth");

      // --- LÓGICA AÑADIDA (limpiar header) ---
      delete apiClient.defaults.headers.common['Authorization'];
      // --- FIN DE LÓGICA AÑADIDA ---
    }
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