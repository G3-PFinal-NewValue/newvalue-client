import { Link } from 'react-router-dom';
import styles from './PsychologistCard.module.css';

export default function PsychologistCard({ psychologist }) {
  console.log("Data received in PsychologistCard:", psychologist);

  const {
    photo_url,
    first_name,
    last_name,
    user_id,
    professional_description
  } = psychologist;


  const psychologistName = first_name && last_name
    ? `${first_name} ${last_name}`
    : `Psicólogo/a #${user_id ?? 'N/D'}`;

  const fallbackInitial = first_name ? first_name[0].toUpperCase() : 'P';

  return (
    <Link to={`/profile/${user_id}`} className={styles.cardLink}>
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
          
          <p className={styles.specialty}>
            {professional_description?.substring(0, 50) + (professional_description?.length > 50 ? '...' : '') || 'Descripción no disponible'}
          </p>
        </div>
      </article>
    </Link>
  );
}