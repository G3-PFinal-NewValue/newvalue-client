import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useLogout } from "../../../hooks/useLogout";
import styles from "./Navbar.module.css";

// Importa los iconos que necesites
import { CiLogin, CiLogout } from "react-icons/ci";
import { ImProfile } from "react-icons/im"; // Para perfil psicólogo
import { LuLayoutDashboard, LuUserCog, LuCalendarClock } from "react-icons/lu"; // Para admin, perfil paciente, citas paciente

export default function Navbar() {
  const { user } = useAuth();
  const logout = useLogout();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Variables de estado y roles
  const isLoggedIn = !!user;
  const isPatient = user?.role === "patient";
  const isPsychologist = user?.role === "psychologist";
  const isAdmin = user?.role === "admin";

  // Función para marcar link activo (ajustada para rutas con parámetros)
  const isActive = (path, exact = false) => {
    if (exact) return pathname === path ? styles.active : "";
    if (pathname.startsWith(path) && path !== '/') {
        const pathSegments = path.split('/').filter(Boolean);
        const pathnameSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length <= pathnameSegments.length) {
            // Verifica que todos los segmentos base coincidan
            // Ej: /profile/123 activa /profile/:id, pero /profile-setup no
            return pathSegments.every((seg, i) => seg === pathnameSegments[i] || pathSegments[i].startsWith(':')) ? styles.active : "";
        }
    }
    // Handle root path separately only if exact match is not required
    if (!exact && path === '/' && pathname === '/') return styles.active;
    // Evita activar isActive('/') para todas las rutas
    return pathname.startsWith(path) && path !== '/' ? styles.active : "";
  };


  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link to="/" className={styles.logo} aria-label="Ir a inicio">
          <img
            src="/images/coramind_logo_long.png" // Asegúrate que esta ruta sea correcta desde public/
            alt="Cora Mind"
            className={styles.logoImg}
          />
        </Link>

        {/* LINKS (desktop) */}
        <nav className={styles.navLinks}>
          {/* Links Públicos o para Todos los Logueados */}
          <Link to="/psychologists" className={`${styles.link} ${isActive("/psychologists")}`}>
            Conócenos {/* Nombre original */}
          </Link>
          <Link to="/social-project" className={`${styles.link} ${isActive("/social-project")}`}>
             Proyecto social {/* Nombre original */}
           </Link>
           <Link to="/treatments" className={`${styles.link} ${isActive("/treatments")}`}>
             Tratamientos {/* Nombre original */}
           </Link>
          <Link to="/blog" className={`${styles.link} ${isActive("/blog")}`}>
            Recursos gratuitos {/* Nombre original */}
          </Link>

          {/* Links Paciente */}
          {isPatient && (
            <>
              {/* Ajustado: Mi Perfil ahora apunta a /app/my-profile */}
              <Link to="/app/my-profile" className={`${styles.link} ${isActive("/app/my-profile", true)}`}>
                 Mi Perfil
              </Link>
              {/* Ajustado: Mis Citas ahora apunta a /app/my-appointments */}
              <Link to="/app/my-appointments" className={`${styles.link} ${isActive("/app/my-appointments", true)}`}>
                  Mis Citas
              </Link>
            </>
          )}

          {/* Links Psicólogo */}
          {isPsychologist && (
            <>
              {user?.id && (
                  <Link
                    to={`/profile/${user.id}`} // Enlace al perfil público
                    className={`${styles.link} ${isActive(`/profile/${user.id}`, true)}`}
                  >
                     Mi Perfil {/* Texto original del archivo */}
                  </Link>
              )}
               <Link
                to="/app/dashboard" // Ruta del dashboard del psicólogo
                className={`${styles.link} ${isActive("/app/dashboard", true)}`}
              >
                 Mi Panel {/* Texto original del archivo */}
              </Link>
              {/* Añadido enlace para editar perfil si es necesario (ajustar ruta si cambia) */}
              <Link
                to="/app/profile" // Ruta para editar/setup perfil psicólogo
                className={`${styles.link} ${isActive("/app/profile", true)}`}
              >
                 Editar Perfil {/* Opcional: texto descriptivo */}
              </Link>
            </>
          )}

          {/* Links Admin */}
          {isAdmin && (
            <Link to="/admin/dashboard" className={`${styles.link} ${isActive("/admin/dashboard", true)}`}>
               Dashboard {/* Texto original del archivo */}
            </Link>
          )}
        </nav>

        {/* ACCIONES (desktop) */}
        <div className={styles.actions}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.primaryBtn}>
              
              <span>Acceder</span>
            </Link>
          ) : (
            <button onClick={logout} className={styles.secondaryBtn}>
              
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

      {/* OVERLAY y MENÚ MOBILE */}
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} onClick={() => setOpen(false)} />
      <div className={`${styles.mobileMenu} ${open ? styles.mobileOpen : ""}`}>
        <nav className={styles.mobileNav}>
          {/* Links Públicos o Comunes */}
          <Link to="/" className={`${styles.mobileLink} ${isActive("/", true)}`}> Inicio </Link>
          <Link to="/psychologists" className={`${styles.mobileLink} ${isActive("/psychologists")}`}> Conócenos </Link>
          <Link to="/social-project" className={`${styles.mobileLink} ${isActive("/social-project")}`}> Proyecto social </Link>
          <Link to="/treatments" className={`${styles.mobileLink} ${isActive("/treatments")}`}> Tratamientos </Link>
          <Link to="/blog" className={`${styles.mobileLink} ${isActive("/blog")}`}> Recursos gratuitos </Link>

          {/* Links Paciente */}
          {isPatient && (
            <>
              <Link to="/app/my-profile" className={`${styles.mobileLink} ${isActive("/app/my-profile", true)}`}> Mi Perfil </Link>
              <Link to="/app/my-appointments" className={`${styles.mobileLink} ${isActive("/app/my-appointments", true)}`}> Mis Citas </Link>
            </>
          )}

          {/* Links Psicólogo */}
          {isPsychologist && (
            <>
             {/* Cambiado /app/profile por el perfil público */}
              {user?.id && (
                  <Link to={`/profile/${user.id}`} className={`${styles.mobileLink} ${isActive(`/profile/${user.id}`, true)}`}> Mi Perfil Profesional </Link>
              )}
               <Link to="/app/dashboard" className={`${styles.mobileLink} ${isActive("/app/dashboard", true)}`}> Mi Panel </Link>
               {/* Añadido enlace para editar */}
               <Link to="/app/profile" className={`${styles.mobileLink} ${isActive("/app/profile", true)}`}> Editar Perfil </Link>
            </>
          )}

          {/* Links Admin */}
          {isAdmin && (
            <Link to="/admin/dashboard" className={`${styles.mobileLink} ${isActive("/admin/dashboard", true)}`}> Dashboard </Link>
          )}
        </nav>

        {/* Acciones Móviles */}
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