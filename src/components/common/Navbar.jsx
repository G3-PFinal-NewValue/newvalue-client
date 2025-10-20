import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    "px-3 py-2 rounded-md text-sm font-medium " +
    (isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100");

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            
            <div className="h-8 w-8 rounded bg-indigo-600" />
            <span className="font-bold text-lg">Coramind</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={navItemClass}>Home</NavLink>
            
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">Hola, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
            onClick={() => setOpen(o => !o)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink to="/" className={navItemClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-300"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-semibold bg-indigo-600 text-white"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-300 text-left"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
