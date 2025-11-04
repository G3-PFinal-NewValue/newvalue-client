import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { BsSearchHeart, BsPersonWorkspace } from "react-icons/bs";
import { BiDonateHeart } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext";
import SessionCard from "../../../components/SessionCard.jsx";

export default function HomePage() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const isRestrictedRole =
    user?.role === "admin" || user?.role === "psychologist";

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
                {user?.role === "admin" || user?.role === "psychologist"
                  ? "Ver psicólogos"
                  : "Buscar psicólogos"}
              </Link>
            ) : (
              <Link to="/first-session" className={styles.primaryBtn}>
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
            <h2 className={styles.ctaTitle}>
              {user?.role === "admin"
                ? "Panel de administración"
                : user?.role === "psychologist"
                  ? "Gestión de sesiones"
                  : "Mis próximas citas"}
            </h2>
            <p className={styles.ctaText}>
              {user?.role === "admin"
                ? "Accede al panel principal para gestionar usuarios, sesiones y configuración general del sistema."
                : user?.role === "psychologist"
                  ? "Accede a tu panel de gestión para revisar tus sesiones y atender a tus pacientes."
                  : "Revisa tu agenda, gestiona tus sesiones y mantén el equilibrio día a día."}
            </p>
            <Link
              to={
                user?.role === "admin"
                  ? "/admin/dashboard"
                  : user?.role === "psychologist"
                    ? "/app/dashboard"
                    : "/app/my-appointments"
              }
              className={styles.primaryBtn}
            >
              {user?.role === "admin"
                ? "Administración"
                : user?.role === "psychologist"
                  ? "Mi panel profesional"
                  : "Ver mis citas"}
            </Link>
          </>
        ) : (
          <>
            <h2 className={styles.ctaTitle}>¿Listo para empezar?</h2>
            <p className={styles.ctaText}>
              Únete a Cora Mind y da el primer paso hacia tu bienestar mientras ayudas a otros.
            </p>
            <Link to="/first-session" className={styles.primaryBtn}>
              Solicitar primera sesión gratuita
            </Link>
          </>
        )}
      </section>

      {/* --- Sección Cards precios, si el user es admin o psicólogo no lo ve --- */}
      {!isRestrictedRole && (
        <section className={styles.sessionCardsSection}>
          <div className={styles.sessionCardsWrapper}>
            <div className={styles.sessionCardsHeader}>
              <p className={styles.sessionCardsSubtitle}>
                La terapia que transforma más de una vida.
              </p>
              <h2 className={styles.sessionCardsTitle}>
                Reserva tu sesión de psicología online con propósito
              </h2>
              <p className={styles.sessionCardsSubtitle}>
                En Cora Mind, cada sesión que tomas ayuda a que otra persona con menos recursos también reciba acompañamiento psicológico.
              </p>
              <p className={styles.sessionCardsSubtitle}>
                💙 Cuidarte también puede cambiar vidas.
              </p>
            </div>

            <div className={styles.sessionCardsContainer}>
              <SessionCard
                title={["Terapia Individual"]}
                subtitle="45€/sesión"
                firstDescription={[
                  "Única sesión",
                  "Pensada para acompañarte en momentos de cambio, estrés o confusión emocional"
                ]}
                secondDescription="Con esta sesión, destinas 5€ a ofrecer apoyo psicológico a personas con menos recursos"
                buttonText="Reservar ahora"
                onButtonClick={() => console.log("Reservar")}
              />
              <SessionCard
                highlighted={true}
                title={["Pack 5", "Terapia Individual"]}
                subtitle="40€/sesión"
                firstDescription={[
                  "5 sesiones por 200€",
                  "Pensado para acompañarte en un proceso más estable y consciente"
                ]}
                secondDescription="Con este pack, destinas 25€ a ofrecer terapia a personas con menos recursos"
                buttonText="Elegir pack"
                onButtonClick={() => console.log("Reservar")}
              />
              <SessionCard
                title={["Terapia", "familiar/pareja"]}
                subtitle="60€/sesión"
                firstDescription={[
                  "Única sesión",
                  "Pensada para acompañarte en un momento de cambio, estrés o confusión emocional"
                ]}
                secondDescription="Con vuestra sesión, contribuís con 5€ a ofrecer terapia a personas con menos recursos."
                buttonText="Reserva sesión"
                onButtonClick={() => console.log("Reservar")}
              />
            </div>

            {/* Texto debajo de las cards */}
            <div className={styles.sessionCardsFooter}>
              <p>
                🌱 Con Cora Mind, tu bienestar también genera impacto. <br />
                Reserva tu sesión hoy y forma parte de una red de empatía y apoyo
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
