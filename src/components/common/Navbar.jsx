import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
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
    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 " +
    (isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700");

  const { pathname } = useLocation();

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
            <div className="hidden md:flex items-center gap-4">
              {pathname !== "/" && (
                <NavLink to="/" className={navItemClass}>
                  Home
                </NavLink>
              )}

              {pathname !== "/blog" && (
                <NavLink to="/blog" className={navItemClass}>
                  Blog
                </NavLink>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Iniciar sesión
              </Link>
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
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t animate-fadeIn">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink
              to="/"
              className={navItemClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/blog"
              className={navItemClass}
              onClick={() => setOpen(false)}
            >
              Blog
            </NavLink>

            {!user ? (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-semibold border border-gray-300 text-left"
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </Link>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
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
