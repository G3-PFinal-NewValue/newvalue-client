import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>

      <div className={styles.container}>
        {/* Columna 1: Logo + Descripción */}
        <div className={styles.column}>
          <div className={styles.brandSection}>
            <Link to="/" className={styles.logoLink}>
              <img src="/images/coramind_logo_long.png" alt="Cora Mind Logo" className={styles.footerLogo} />
            </Link>
            <p className={styles.tagline}>
              Cada sesión transforma bienestar personal en bienestar compartido.
            </p>
          </div>
        </div>

        {/* Columna 2: Cora Mind + Proyecto Social + Recursos gratuitos */}
        <div className={styles.column}>
          <nav className={styles.navSection}>
            <h4 className={styles.sectionTitle}>CORA MIND</h4>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Quiénes somos</Link></li>
              <li><Link to="/" className={styles.navLink}>Equipo</Link></li>
              <li><Link to="/contacto" className={styles.navLink}>Contáctanos</Link></li>
            </ul>

            <h4 className={styles.sectionTitle}>PROYECTO SOCIAL</h4>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Con Cora Mind</Link></li>
            </ul>

            <h4 className={styles.sectionTitle}>RECURSOS GRATUITOS</h4>
            <ul className={styles.navList}>
              <li><Link to="/blog" className={styles.navLink}>Blog de psicología</Link></li>
            </ul>
          </nav>
        </div>

        {/* Columna 3: Tratamientos */}
        <div className={styles.column}>
          <nav className={styles.navSection}>
            <h4 className={styles.sectionTitle}>TRATAMIENTOS</h4>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Ansiedad y estrés</Link></li>
              <li><Link to="/" className={styles.navLink}>Estado de ánimo</Link></li>
              <li><Link to="/" className={styles.navLink}>Autoestima</Link></li>
              <li><Link to="/" className={styles.navLink}>Relaciones afectivas</Link></li>
              <li><Link to="/" className={styles.navLink}>Pareja y familia</Link></li>
              <li><Link to="/" className={styles.navLink}>Dependencia emocional</Link></li>
            </ul>
          </nav>
        </div>

        {/* Columna 4: Acceder */}
        <div className={styles.column}>
          <nav className={styles.navSection}>
            <h4 className={styles.sectionTitle}>ACCEDER</h4>
            <ul className={styles.navList}>
              <li><Link to="/login" className={styles.navLink}>Login</Link></li>
              <li><Link to="/register" className={styles.navLink}>Registrarse</Link></li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <ul>
            <li><Link to="/" className={styles.navLink}>Aviso legal</Link></li>
            <li><Link to="/" className={styles.navLink}>Política de cookies</Link></li>
            <li><Link to="/" className={styles.navLink}>Protección de datos</Link></li>
          </ul>
        </div>
      </div>

    </footer>
  );
}
