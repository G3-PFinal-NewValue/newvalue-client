import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

// Páginas públicas
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

// Protegidas
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Demo privada (temporal)
function PrivateHome() {
  const { user } = useAuth();
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Área privada</h1>
      <p className="text-gray-700">Hola, {user?.name}. Esta vista requiere estar autenticado.</p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con Layout (Navbar visible) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
        </Route>

        {/* Rutas privadas con Layout (Navbar visible) */}
        <Route element={<Layout />}>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <PrivateHome />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
