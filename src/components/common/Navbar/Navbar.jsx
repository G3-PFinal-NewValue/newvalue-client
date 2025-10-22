import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Ocultar navbar en auth
  if (pathname === "/login" || pathname === "/register") return null;

  // Cierra el menú al navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isLoggedIn = !!user;

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link to="/" className={styles.logo} aria-label="Ir a inicio">
          <img
            src="/images/CropLogo.png"
            alt="Cora Mind"
            className={styles.logoImg}
          />
        </Link>

        {/* LINKS (desktop) */}
        <nav className={styles.navLinks}>
          {pathname !== "/" && (
            <Link to="/" className={styles.link}>Inicio</Link>
          )}
          {!pathname.startsWith("/blog") && (
            <Link to="/blog" className={styles.link}>Blog</Link>
          )}
        </nav>

        {/* ACCIONES (desktop) */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.primaryBtn}>Iniciar sesión</Link>
          ) : (
            <button onClick={logout} className={styles.secondaryBtn}>Cerrar sesión</button>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA (mobile) */}
        <button
          className={styles.burger}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.line} ${open ? styles.lineTopOpen : ""}`} />
          <span className={`${styles.line} ${open ? styles.lineMidOpen : ""}`} />
          <span className={`${styles.line} ${open ? styles.lineBotOpen : ""}`} />
        </button>
      </div>

      {/* OVERLAY (mobile) */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* MENÚ MOBILE */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileOpen : ""}`}>
        <nav className={styles.mobileNav}>
          {pathname !== "/" && (
            <Link to="/" className={styles.mobileLink}>Inicio</Link>
          )}
          {!pathname.startsWith("/blog") && (
            <Link to="/blog" className={styles.mobileLink}>Blog</Link>
          )}
        </nav>

        <div className={styles.mobileActions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.mobilePrimary}>
              Iniciar sesión
            </Link>
          ) : (
            <button onClick={logout} className={styles.mobileSecondary}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
