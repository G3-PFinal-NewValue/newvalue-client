import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
// Necesitaremos un servicio para obtener los datos del paciente (cuando exista el backend)
// import { getMyPatientProfile } from '../../../services/patientService'; 
import styles from './MyPatientProfile.module.css'; // Crearemos este CSS

export default function MyPatientProfile() {
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const [patientData, setPatientData] = useState(null); // Para guardar datos específicos del paciente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Simulación de carga de datos ---
  // Cuando el backend esté listo, reemplazaremos esto con una llamada a API
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulación: Por ahora no tenemos dónde buscar los datos específicos
    // (birth_date, goals, history). Mostraremos placeholders.
    // Cuando exista el servicio, sería algo así:
    /*
    getMyPatientProfile()
      .then(data => setPatientData(data))
      .catch(err => setError("No se pudo cargar tu perfil."))
      .finally(() => setLoading(false));
    */

    // Simulación simple (solo quitamos el loading)
    setTimeout(() => {
       setPatientData({ // Datos simulados o placeholders
         birth_date: "No añadido", 
         therapy_goals: "No añadidos",
         medical_history: "No añadido"
       });
       setLoading(false);
    }, 500); // Simular 0.5s de carga

  }, [user]); // Depende del usuario por si cambia

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.page}><p>Cargando tu perfil...</p></div>;
  }
  if (error) {
     return <div className={styles.page}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Mi Perfil</h1>

          {/* Sección Foto y Datos Básicos */}
          <div className={styles.headerSection}>
             <div className={styles.avatar}>
               {/* TODO: Usar la foto guardada si existiera */}
               <div className={styles.avatarFallback}>
                 {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
               </div>
             </div>
             <div className={styles.userInfo}>
               <h2 className={styles.name}>{user?.first_name || 'Nombre'} {user?.last_name || 'Apellido'}</h2>
               <p className={styles.email}>{user?.email || 'email@ejemplo.com'}</p>
             </div>
          </div>

          {/* Sección Datos Específicos del Paciente */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Detalles del Perfil</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de Nacimiento:</span>
              <span className={styles.detailValue}>{patientData?.birth_date || 'N/D'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Objetivos de Terapia:</span>
              <p className={styles.detailValueBlock}>{patientData?.therapy_goals || 'N/D'}</p>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Historial Médico Relevante:</span>
              <p className={styles.detailValueBlock}>{patientData?.medical_history || 'N/D'}</p>
            </div>
          </div>

          {/* TODO: Añadir botón para Editar Perfil */}
          {/* <button className={styles.editButton}>Editar Perfil</button> */}

        </div>
      </div>
    </div>
  );
}