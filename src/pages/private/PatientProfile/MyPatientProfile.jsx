import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para el botón editar
import { useAuth } from '../../../context/AuthContext';
// import { getMyPatientProfile } from '../../../services/patientService'; 
import styles from './MyPatientProfile.module.css'; 

export default function MyPatientProfile() {
  const { user } = useAuth(); 
  const [patientData, setPatientData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Simulación de carga de datos ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulación: Cargamos placeholders
    setTimeout(() => {
       setPatientData({ 
         birth_date: "No añadido", 
         therapy_goals: "No añadidos",
         medical_history: "No añadido"
       });
       setLoading(false);
    }, 500); 

  }, [user]); 

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.page}><div className={styles.loadingCard}>Cargando tu perfil...</div></div>;
  }
  if (error) {
     return <div className={styles.page}><div className={`${styles.card} ${styles.errorCard}`}>{error}</div></div>;
  }

  // Fallback para iniciales si no hay nombre
  const fallbackInitial = user?.first_name ? user.first_name[0].toUpperCase() : 'U';

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* Tarjeta Principal */}
        <div className={styles.card}>
          <h1 className={styles.mainTitle}>Mi Perfil</h1>

          {/* Sección Foto y Datos Básicos */}
          <section className={styles.headerSection}>
             <div className={styles.avatar}>
               {/* TODO: Implementar carga de foto real si se guarda */}
               <div className={styles.avatarFallback}>{fallbackInitial}</div>
             </div>
             <div className={styles.userInfo}>
               <h2 className={styles.name}>{user?.first_name || 'Nombre'} {user?.last_name || 'Apellido'}</h2>
               <p className={styles.email}>{user?.email || 'email@ejemplo.com'}</p>
               {/* Podríamos añadir el rol si fuera útil */}
               {/* <span className={styles.roleTag}>{user?.role || 'Paciente'}</span> */}
             </div>
             {/* Botón Editar */}
             <Link to="/app/profile-setup/patient" className={styles.editButton}>
               Editar Perfil
             </Link>
          </section>

          {/* Sección Detalles Específicos del Paciente */}
          <section className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Detalles de Terapia</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de Nacimiento</span>
              <span className={styles.detailValue}>{patientData?.birth_date || 'N/D'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Objetivos de Terapia</span>
              {/* Usamos un div para el texto largo */}
              <div className={styles.detailValueBlock}>{patientData?.therapy_goals || 'No especificados'}</div>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Historial Médico Relevante</span>
              <div className={styles.detailValueBlock}>{patientData?.medical_history || 'No especificado'}</div>
            </div>
          </section>

          {/* --- Placeholder: Próximas Citas --- */}
          {/* <section className={styles.appointmentsSection}>
             <h3 className={styles.sectionTitle}>Próximas Citas</h3>
             <p className={styles.mutedText}>Aquí aparecerán tus citas agendadas.</p>
             {/* Aquí iría una lista o componente de citas }
          </section> 
          */}

        </div>
      </div>
    </div>
  );
}