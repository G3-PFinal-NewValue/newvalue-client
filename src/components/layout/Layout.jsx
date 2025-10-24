import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar/Navbar";
import styles from "./Layout.module.css"; // <-- 1. Importar el módulo CSS
import Footer from "../../components/common/Footer/Footer"; // <-- 1. Importar Footer

export default function Layout() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  // Podríamos ocultar el Footer también en login/register si quisiéramos
  const hideFooter = hideNavbar; 

  return (
    <div className={styles.layout}> 
      {!hideNavbar && <Navbar />}

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* 👇 2. Añadir el Footer aquí 👇 */}
      {!hideFooter && <Footer />} 
    </div>
  );
}