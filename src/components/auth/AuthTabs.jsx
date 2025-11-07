import { Link, useLocation } from "react-router-dom";
import styles from "./AuthTabs.module.css";

export default function AuthTabs() {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";
  const isRegister =
    pathname === "/register" || pathname === "/register-professional";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.logo}>

          <Link to="/">
            <img
              className={styles.logo}
              src="/images/LongLogo.png"
              alt="Cora Mind Logo"
            />
          </Link>

        </div>
      </div>

      <div className={styles.tabsBar}>
        <Link
          to="/login"
          className={`${styles.tab} ${isLogin ? styles.active : ""}`}
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className={`${styles.tab} ${isRegister ? styles.active : ""}`}
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
