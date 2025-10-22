import { Link } from "react-router-dom";
import styles from "./Footer.module.css"; 
import { FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Sección de Logo/Nombre */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.logoLink}>
            {/* Podríamos usar el logo corto o solo texto */}
            <img
              src="/images/CropLogo.png"
              alt="Cora Mind Logo"
              className={styles.footerLogo}
            />
            {/* <span className={styles.brandName}>Cora Mind</span> */}
          </Link>
          <p className={styles.tagline}>Corazón y mente en equilibrio.</p>
        </div>

        {/* Sección de Enlaces */}
        <nav className={styles.navSection}>
          <h4 className={styles.sectionTitle}>Navegación</h4>
          <ul className={styles.navList}>
            <li>
              <Link to="/" className={styles.navLink}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/blog" className={styles.navLink}>
                Blog
              </Link>
            </li>
            {/* Añadir enlaces a "Cómo funciona", "Sobre nosotros" cuando existan */}
            <li>
              <Link to="/#how-it-works" className={styles.navLink}>
                Cómo funciona
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sección Legal/Contacto (Placeholder) */}
        <nav className={styles.navSection}>
          <h4 className={styles.sectionTitle}>Legal</h4>
          <ul className={styles.navList}>
            <li>
              <Link to="/terminos" className={styles.navLink}>
                Términos de Servicio
              </Link>
            </li>
            <li>
              <Link to="/privacidad" className={styles.navLink}>
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/contacto" className={styles.navLink}>
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.socialSection}>
          <h4 className={styles.sectionTitle}>Síguenos</h4>
          <div className={styles.socialIcons}>
            {/* 👇 2. Usar los componentes importados 👇 */}
            <a
              href="https://instagram.com/concoramind" // URL Real
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              {/* Puedes pasar size y className */}
              <FiInstagram size={20} />
            </a>
            <a
              href="#" // URL Real
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={styles.socialLink}
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          © {currentYear} Cora Mind. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
