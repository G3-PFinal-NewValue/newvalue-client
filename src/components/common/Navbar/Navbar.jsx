import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";

import { IoHomeOutline } from "react-icons/io5";
import { GrArticle } from "react-icons/gr";
import { CiLogin, CiLogout } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlinePsychologyAlt } from "react-icons/md";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (pathname === "/login" || pathname === "/register") return null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isLoggedIn = !!user;
  const isPatient = user?.role === "patient";
  const isPsychologist = user?.role === "psychologist";
  const isAdmin = user?.role === "admin";

  // Función para marcar link activo
  const isActive = (path) => pathname.startsWith(path) ? styles.active : "";

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link to="/" className={styles.logo} aria-label="Ir a inicio">
          <img
            src="/images/coramind_logo_long.png"
            alt="Cora Mind"
            className={styles.logoImg}
          />
        </Link>

        {/* LINKS (desktop) */}
        <nav className={styles.navLinks}>
          <Link to="/psychologists" className={`${styles.link} ${isActive("/psychologists")}`}>
            Conócenos
          </Link>

          <Link to="/social-project" className={`${styles.link} ${isActive("/social-project")}`}>
            Proyecto social
          </Link>

          <Link to="/treatments" className={`${styles.link} ${isActive("/treatments")}`}>
            Tratamientos
          </Link>

          <Link to="/blog" className={`${styles.link} ${isActive("/blog")}`}>
            Recursos gratuitos
          </Link>

          {isPatient && (
            <Link to="/app/my-profile" className={`${styles.link} ${isActive("/app/my-profile")}`}>
              Mi Perfil
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/app/my-appointments" className={`${styles.link} ${isActive("/app/my-appointments")}`}>
              Mis Citas
            </Link>
          )}

          {isPsychologist && (
            <Link to="/app/profile" className={`${styles.link} ${isActive("/app/profile")}`}>
              Mi Perfil Profesional
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/app/dashboard" className={`${styles.link} ${isActive("/app/dashboard")}`}>
              Mi Panel
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" className={`${styles.link} ${isActive("/admin/dashboard")}`}>
              <LuLayoutDashboard className={styles.icon} />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* ACCIONES (desktop) */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.primaryBtn}>
              <CiLogin className={styles.icon} />
              <span>Acceder</span>
            </Link>
          ) : (
            <button onClick={logout} className={styles.secondaryBtn}>
              <CiLogout className={styles.icon} />
              <span>Cerrar sesión</span>
            </button>
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
          <Link to="/psychologists" className={`${styles.mobileLink} ${isActive("/psychologists")}`}>
            Conócenos
          </Link>

          <Link to="/social-project" className={`${styles.mobileLink} ${isActive("/social-project")}`}>
            Proyecto social
          </Link>

          <Link to="/treatments" className={`${styles.mobileLink} ${isActive("/treatments")}`}>
            Tratamientos
          </Link>

          <Link to="/blog" className={`${styles.mobileLink} ${isActive("/blog")}`}>
            Recursos gratuitos
          </Link>

          {isPatient && (
            <Link to="/app/my-profile" className={`${styles.mobileLink} ${isActive("/app/my-profile")}`}>
              Mi Perfil
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/app/my-appointments" className={`${styles.mobileLink} ${isActive("/app/my-appointments")}`}>
              Mis Citas
            </Link>
          )}

          {isPsychologist && (
            <Link to="/app/profile" className={`${styles.mobileLink} ${isActive("/app/profile")}`}>
              Mi Perfil Profesional
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/app/dashboard" className={`${styles.mobileLink} ${isActive("/app/dashboard")}`}>
              Mi Panel
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" className={`${styles.mobileLink} ${isActive("/admin/dashboard")}`}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className={styles.mobileActions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.mobilePrimary}>
              <CiLogin className={styles.icon} />
              <span>Iniciar sesión</span>
            </Link>
          ) : (
            <button onClick={logout} className={styles.mobileSecondary}>
              <CiLogout className={styles.icon} />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
