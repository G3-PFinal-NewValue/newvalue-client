import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
