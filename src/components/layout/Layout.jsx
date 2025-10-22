import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar/Navbar";
import styles from "./Layout.module.css"; // <-- 1. Importar el módulo CSS

export default function Layout() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    // 👇 2. Usar la clase del módulo
    <div className={styles.layout}> 
      {!hideNavbar && <Navbar />}
      {/* 👇 3. Usar la clase del módulo */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}