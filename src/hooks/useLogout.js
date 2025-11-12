import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    try {
      await authLogout();
      // Siempre redirigir al Home después del logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Incluso si hay error, redirigir al Home por seguridad
      navigate('/', { replace: true });
    }
  };

  return logout;
};
