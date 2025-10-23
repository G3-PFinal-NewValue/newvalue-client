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
            <Link to="/" className={styles.link}>
              <IoHomeOutline className={styles.icon} /> {/* Icono Inicio */}
              <span>Inicio</span>
            </Link>
          )}
          {/* 👇 Añadir enlace a Psicólogos (Mobile) 👇 */}
          {!pathname.startsWith("/psychologists") && (
            <Link
              to="/psychologists"
              className={styles.link}
              aria-label="Psicólogos" // <-- 3. Añadir aria-label
            >
              <MdOutlinePsychologyAlt size={24} className={styles.icon} /> 
               <span>Psicólogos</span>{/* <-- 2. Usar icono */}
            </Link>
          )}
          {!pathname.startsWith("/blog") && (
            <Link to="/blog" className={styles.link}>
              <GrArticle className={styles.icon} /> {/* Icono Blog */}
              <span>Blog</span>
            </Link>
          )}
          {isPatient && pathname !== "/app/my-profile" && (
            <Link to="/app/my-profile" className={styles.link}>
              <ImProfile className={styles.icon} /> {/* Icono Perfil */}
              <span>Mi Perfil</span>
            </Link>
          )}
          {pathname !== "/app/my-appointments" && (
                <Link to="/app/my-appointments" className={styles.link}>Mis Citas</Link>
              )}
          {isPsychologist && pathname !== "/app/profile" && (
            <Link to="/app/profile" className={styles.link}>
              <ImProfile className={styles.icon} /> {/* Icono Perfil */}
              <span>Mi Perfil Profesional</span>
            </Link>
          )}
          {pathname !== "/app/dashboard" && ( /* */
                 <Link to="/app/dashboard" className={styles.link}>Mi Panel</Link> /* */
               )}
          {isAdmin && pathname !== "/admin/dashboard" && (
            <Link to="/admin/dashboard" className={styles.link}>
              <LuLayoutDashboard className={styles.icon} />{" "}
              {/* Icono Dashboard */}
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* ACCIONES (desktop) */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.primaryBtn}>
              <CiLogin className={styles.icon} /> {/* Icono Login */}
              <span>Iniciar sesión</span>
            </Link>
          ) : (
            <button onClick={logout} className={styles.secondaryBtn}>
              <CiLogout className={styles.icon} /> {/* Icono Logout */}
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA (mobile) */}
        {/* ... (sin cambios aquí) ... */}
        <button
          className={styles.burger}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`${styles.line} ${open ? styles.lineTopOpen : ""}`}
          />
          <span
            className={`${styles.line} ${open ? styles.lineMidOpen : ""}`}
          />
          <span
            className={`${styles.line} ${open ? styles.lineBotOpen : ""}`}
          />
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
            <Link to="/" className={styles.mobileLink}>
              <IoHomeOutline className={styles.icon} />
              <span>Inicio</span>
            </Link>
          )}
          {!pathname.startsWith("/psychologists") && (
            <Link to="/psychologists" className={styles.mobileLink}>
              Psicólogos
            </Link>
          )}
          {!pathname.startsWith("/blog") && (
            <Link to="/blog" className={styles.mobileLink}>
              <GrArticle className={styles.icon} />
              <span>Blog</span>
            </Link>
          )}
          {isPatient && pathname !== "/app/my-profile" && (
            <Link to="/app/my-profile" className={styles.mobileLink}>
              <ImProfile className={styles.icon} />
              <span>Mi Perfil</span>
            </Link>
          )}
          {isPsychologist && pathname !== "/app/profile" && (
            <Link to="/app/profile" className={styles.mobileLink}>
              <ImProfile className={styles.icon} />
              <span>Mi Perfil Profesional</span>
            </Link>
          )}
          {isAdmin && pathname !== "/admin/dashboard" && (
            <Link to="/admin/dashboard" className={styles.mobileLink}>
              <LuLayoutDashboard className={styles.icon} />
              <span>Dashboard</span>
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
