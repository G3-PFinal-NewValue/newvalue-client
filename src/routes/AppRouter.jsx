import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Hola, {user?.name}</h1>
        <p className="text-gray-600 mb-6">Estás dentro 🎉</p>
        <div className="flex gap-3 justify-center">
          <button onClick={logout} className="px-4 py-2 rounded bg-gray-200">Logout</button>
          <Link to="/login" className="px-4 py-2 rounded bg-indigo-600 text-white">Ir a Login</Link>
        </div>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />

        {/* protegida */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
