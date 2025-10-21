import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Ocultar en auth
  if (pathname === "/login" || pathname === "/register") return null;

  const isLoggedIn = !!user;

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/images/LongLogo.png" alt="Cora Mind" className={styles.logoImg} />
        </Link>

        {/* Links */}
        <nav className={styles.navLinks}>
          {pathname !== "/" && <Link to="/" className={styles.link}>Inicio</Link>}
          {!pathname.startsWith("/blog") && <Link to="/blog" className={styles.link}>Blog</Link>}
        </nav>

        {/* Acciones derecha */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.primaryBtn}>Iniciar sesión</Link>
          ) : (
            <button onClick={logout} className={styles.secondaryBtn}>Cerrar sesión</button>
          )}
        </div>
      </div>
    </header>
  );
}
