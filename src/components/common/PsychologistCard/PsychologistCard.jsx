import { Link } from 'react-router-dom';
import styles from './PsychologistCard.module.css';

export default function PsychologistCard({ psychologist }) {
  console.log("Data received in PsychologistCard:", psychologist);

  const {
    photo,
    user,
    user_id,
    specialities
  } = psychologist;


const psychologistName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : `Psicólogo/a #${user_id ?? 'N/D'}`;

const fallbackInitial = user?.first_name ? user.first_name[0].toUpperCase() : 'P';

const photoToShow = photo || user?.avatar;

const specialtyText = specialities && specialities.length > 0
    ? specialities[0].name // Mostramos solo la primera para que quepa
    : 'Especialidad no definida'; // Fallback

return (
    <Link to={`/profile/${user_id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.avatarContainer}>
          {photoToShow ? ( // <-- Usar photoToShow
            <img src={photoToShow} alt={`Foto de ${psychologistName}`} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarFallback}>{fallbackInitial}</div> // <-- Usar fallbackInitial
          )}
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.name}>{psychologistName}</h3>
          
          <p className={styles.specialty}>
            {specialtyText} {/* <-- Mostrar la especialidad */}
          </p>
        </div>
      </article>
    </Link>
  );
}