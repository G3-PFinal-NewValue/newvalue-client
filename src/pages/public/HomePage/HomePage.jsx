import { Link } from "react-router-dom"; // Necesitamos Link para los botones
import styles from "./HomePage.module.css"; // Importamos el CSS module
import SearchUserIcon from "../../../components/icons/SearchUserIcon";
import LaptopUserIcon from "../../../components/icons/LaptopUserIcon";
import HeartHandsIcon from "../../../components/icons/HeartHandsIcon";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* --- Sección Hero --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Corazón y mente en equilibrio, con psicología online.
          </h1>
          <p className={styles.heroSubtitle}>
            Encuentra tu bienestar y genera impacto social. Cada sesión que
            tomas ayuda a que otra persona reciba apoyo psicológico gratuito.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryBtn}>
              Empezar ahora
            </Link>
            {/* Podríamos añadir un botón secundario si es necesario */}
            {/* <Link to="/como-funciona" className={styles.secondaryBtn}>Cómo funciona</Link> */}
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          {/* 👇 El div placeholder AHORA CONTIENE la imagen 👇 */}
          <div className={styles.heroImagePlaceholder}>
            {/* 👇 Ruta corregida y alt text añadido 👇 */}
            <img
              src="/images/foto1.jpeg"
              alt="Persona sonriendo mientras usa un portátil al aire libre"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.stepsGrid}>
          {/* Paso 1 */}
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <SearchUserIcon
                size={48}
                color="var(--color-brand-primary)"
                strokeWidth={1.5}
              />
            </div>
            <h3 className={styles.stepTitle}>Elige a tu psicólogo</h3>
            <p className={styles.stepText}>
              Explora perfiles y encuentra al profesional que mejor se adapte a
              ti.
            </p>
          </div>
          {/* Paso 2 */}
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <LaptopUserIcon
                size={48}
                color="var(--color-brand-primary)"
                strokeWidth={1.5}
              />
            </div>
            <h3 className={styles.stepTitle}>Conéctate desde donde estés</h3>
            <p className={styles.stepText}>
              Realiza tus sesiones online de forma segura y cómoda.
            </p>
          </div>
          {/* Paso 3 */}
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <HeartHandsIcon
                size={48}
                color="var(--color-brand-primary)"
                strokeWidth={1.5}
              />
            </div>
            <h3 className={styles.stepTitle}>Ayuda a alguien más</h3>
            <p className={styles.stepText}>
              Con cada sesión, contribuyes a que otra persona reciba apoyo
              gratuito.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección Impacto Social --- */}
      <section className={styles.socialImpactSection}>
        <div className={styles.socialImpactImagePlaceholder}>
          {/* Podríamos poner otra imagen aquí */}
        </div>
        <div className={styles.socialImpactContent}>
          <h2 className={styles.sectionTitle}>
            Tu bienestar impulsa el cambio
          </h2>
          <p className={styles.socialImpactText}>
            En Cora Mind, creemos que cuidar tu mente es un acto poderoso que
            resuena más allá de ti. Por eso, conectamos tu proceso personal con
            un propósito colectivo: cada sesión que realizas nos permite ofrecer
            ayuda psicológica gratuita a personas con recursos limitados.
          </p>
          <p className={styles.socialImpactText}>
            Así, mientras tú encuentras equilibrio y crecimiento, también estás
            ayudando a construir un mundo con mayor acceso a la salud mental.
          </p>
          {/* <Link to="/nuestro-impacto" className={styles.secondaryBtn}>Conoce más</Link> */}
        </div>
      </section>

      {/* --- Sección CTA Final --- */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>¿Listo/a para empezar?</h2>
        <p className={styles.ctaText}>
          Únete a Cora Mind y da el primer paso hacia tu bienestar mientras
          ayudas a otros.
        </p>
        <Link to="/register" className={styles.primaryBtn}>
          Crear mi cuenta
        </Link>
      </section>
    </div>
  );
}
