import { Link, useLocation } from "react-router-dom";

export default function AuthTabs() {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";

  const tabBase =
    "w-1/2 text-center text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200";

  return (
    <div className="mx-auto max-w-md">
      {/* Header tipo Figma (logo + título) */}
      <div className="text-center mb-4">
        <div className="mx-auto h-10 w-10 rounded-full bg-indigo-600 mb-2" />
        <h2 className="text-indigo-700 font-bold">MindConnect</h2>
        <p className="text-gray-500 text-sm">Tu plataforma de apoyo psicológico online</p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-200 rounded-full p-1 flex mb-4">
        <Link
          to="/login"
          className={
            tabBase +
            " " +
            (isLogin ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900")
          }
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className={
            tabBase +
            " " +
            (isRegister ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900")
          }
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
