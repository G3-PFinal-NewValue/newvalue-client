// src/components/psychologist/PsychologistCard/PsychologistCard.jsx
import { Link } from 'react-router-dom';
import styles from './PsychologistCard.module.css';

// Recibimos los datos del psicólogo como props
export default function PsychologistCard({ psychologist }) {
  // Extraemos los datos necesarios del objeto psychologist
  // Usamos ?? para valores por defecto si algún dato falta
  const {
    id,
    photo_url,
    specialty,
    // Asumimos que tendremos first_name y last_name eventualmente
    first_name,
    last_name,
    user_id // Como fallback si no hay nombres
  } = psychologist;

  // Construimos el nombre, o usamos un placeholder
  const psychologistName = first_name && last_name
    ? `${first_name} ${last_name}`
    : `Psicólogo/a #${user_id ?? id}`; // Fallback con ID

  // Placeholder para iniciales si no hay foto ni nombre
  const fallbackInitial = first_name ? first_name[0].toUpperCase() : 'P';

  return (
    // Enlace a la página de perfil público usando el ID del *perfil*
    <Link to={`/profile/${id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.avatarContainer}>
          {photo_url ? (
            <img src={photo_url} alt={`Foto de ${psychologistName}`} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarFallback}>{fallbackInitial}</div>
          )}
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.name}>{psychologistName}</h3>
          <p className={styles.specialty}>{specialty || 'Especialidad no definida'}</p>
          {/* Podríamos añadir más info aquí si la tuviéramos, ej. años de experiencia */}
        </div>
        {/* Podríamos añadir un botón "Ver perfil" si el diseño lo requiere */}
        {/* <span className={styles.viewProfileButton}>Ver perfil</span> */}
      </article>
    </Link>
  );
}