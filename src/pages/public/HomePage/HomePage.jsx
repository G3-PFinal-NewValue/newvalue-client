import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { BsSearchHeart, BsPersonWorkspace } from "react-icons/bs";
import { BiDonateHeart } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

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
            {isAuthenticated ? (
              <Link to="/psychologists" className={styles.primaryBtn}>
                Buscar psicólogos
              </Link>
            ) : (
              <Link to="/register" className={styles.primaryBtn}>
                Empezar ahora
              </Link>
            )}
          </div>
        </div>

        <div className={styles.heroImageContainer}>
          <div className={styles.heroImagePlaceholder}>
            <img
              src="/images/foto1.jpeg"
              alt="Persona sonriendo mientras usa un portátil al aire libre"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* --- Sección ¿Cómo funciona? --- */}
      <section className={styles.howItWorksSection}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <BsSearchHeart
                size={38}
                color="var(--color-brand-primary)"
                strokeWidth={0.2}
              />
            </div>
            <h3 className={styles.stepTitle}>Elige a tu psicólogo</h3>
            <p className={styles.stepText}>
              Explora perfiles y encuentra al profesional que mejor se adapte a ti.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <BsPersonWorkspace
                size={38}
                color="var(--color-brand-primary)"
                strokeWidth={0.2}
              />
            </div>
            <h3 className={styles.stepTitle}>Conéctate desde donde estés</h3>
            <p className={styles.stepText}>
              Realiza tus sesiones online de forma segura y cómoda.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>
              <BiDonateHeart
                size={38}
                color="var(--color-brand-primary)"
                strokeWidth={0.2}
              />
            </div>
            <h3 className={styles.stepTitle}>Ayuda a alguien más</h3>
            <p className={styles.stepText}>
              Con cada sesión, contribuyes a que otra persona reciba apoyo gratuito.
            </p>
          </div>
        </div>
      </section>

      {/* --- Sección Impacto Social --- */}
      <section className={styles.socialImpactSection}>
        <div className={styles.socialImpactImagePlaceholder}>
          <img
            src="/images/foto2.jpg"
            alt="Persona sonriendo mientras usa un portátil al aire libre"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.socialImpactContent}>
          <h2 className={styles.sectionTitle}>Tu bienestar impulsa el cambio</h2>
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
        </div>
      </section>

      {/* --- Sección CTA Final --- */}
      <section className={styles.ctaSection}>
        {isAuthenticated ? (
          <>
            <h2 className={styles.ctaTitle}>Mis próximas citas</h2>
            <p className={styles.ctaText}>
              Revisa tu agenda, gestiona tus sesiones y mantén el equilibrio día a día.
            </p>
            <Link to="/app/my-appointments" className={styles.primaryBtn}>
              Ver mis citas
            </Link>
          </>
        ) : (
          <>
            <h2 className={styles.ctaTitle}>¿Listo para empezar?</h2>
            <p className={styles.ctaText}>
              Únete a Cora Mind y da el primer paso hacia tu bienestar mientras ayudas a otros.
            </p>
            <Link to="/register" className={styles.primaryBtn}>
              Crear mi cuenta
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
