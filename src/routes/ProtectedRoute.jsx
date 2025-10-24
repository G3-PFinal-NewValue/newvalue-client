import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 2. Si no está logueado, redirigir a login 
  if (!user) {
     return <Navigate to="/login" replace />;
  }

  // 3. Si se especificaron roles permitidos Y el rol del usuario NO está en la lista...
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     // ...redirigir a una página de "No autorizado" o a la home
     // Por ahora, redirigimos a la home ('/app' si está logueado)
     console.warn(`Acceso denegado a ruta. Rol requerido: ${allowedRoles.join('/')}, Rol actual: ${user.role}`);
     return <Navigate to="/app" replace />; 
  }

  // 4. Si pasó las verificaciones, renderizar el componente hijo
  return children;
}