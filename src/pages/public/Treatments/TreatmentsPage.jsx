import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TreatmentsPage.module.css";

const treatments = [
  {
    title: "Ansiedad y estrés",
    description:
      "Cuando los pensamientos no paran o sientes que todo te supera, te ayudamos a recuperar la calma y el equilibrio.",
  },
  {
    title: "Estado de ánimo",
    description:
      "Si la tristeza se alarga y nada parece motivarte, te acompañamos a entender tus emociones y reencontrar tu bienestar.",
  },
  {
    title: "Autoestima",
    description:
      "Fortalece tu confianza, aprende a valorarte y construye un relación más sana contigo mismo.",
  },
  {
    title: "Relaciones",
    description:
      "Mejora tu forma de relacionarte, pon límites con amor y aprende a comunicarte desde la empatía.",
  },
  {
    title: "Pareja y familia",
    description:
      "Cuando la conexión se debilita o surgen conflictos, trabajamos para restaurar la comprensión y el vínculo emocional.",
  },
  {
    title: "Dependencia emocional",
    description:
      "Te acompañamos en procesos de duelo o en vínculos que generan dolor, para avanzar hacia una vida más libre y serena.",
  },
];

const TreatmentsPage = () => {
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate("/first-session");
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.sessionCardsSection}>
        <div className={styles.sessionCardsHeader}>
          <h2 className={styles.sessionCardsTitle}>Nuestros Tratamientos</h2>
          <p className={styles.sessionCardsSubtitle}>
            Te acompañamos a mejorar tu bienestar emocional y a construir una vida más equilibrada.
          </p>
        </div>

        <div className={styles.sessionCardsWrapper}>
          <div className={styles.sessionCardsContainer}>
            {treatments.map((treatment, index) => (
              <div key={index} className={styles.treatmentCard}>
                <h3 className={styles.treatmentTitle}>{treatment.title}</h3>
                <img
                  src="/images/confused_dooble.png"
                  alt="Ícono decorativo"
                  className={styles.treatmentIcon}
                />
                <p className={styles.treatmentText}>{treatment.description}</p>
                <button className={styles.treatmentBtn}>
                  Ver tratamiento &gt;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sessionCardsFooter}>
          <p>Agenda tu cita y descubre el tratamiento más adecuado para ti.</p>
          <button className={styles.primaryBtn} onClick={handleReserveClick}>
            Reserva tu primera sesión
          </button>
        </div>
      </section>
    </div>
  );
};

export default TreatmentsPage;
