import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getPatientProfileById } from '../../../services/patientService'; // Ajusta la ruta si es necesario
import styles from './MyPatientProfile.module.css'; // Asegúrate que este CSS es para MOSTRAR, no para el FORM

export default function MyPatientProfile() {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null); // Estado para guardar los datos del perfil
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Carga de datos con useEffect ---
  useEffect(() => {
    if (!user || !user.id) {
        setError("Usuario no autenticado.");
        setLoading(false);
        return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getPatientProfileById(user.id);
        if (profile) {
          setPatientData(profile);
        } else {
          console.log("Perfil de paciente aún no creado para user:", user.id);
          // Establece valores por defecto o null para indicar que no existe
          setPatientData(null); // O un objeto vacío {} si prefieres
          // Considera redirigir a setup si el perfil es obligatorio
          // import { useNavigate } from 'react-router-dom'; const navigate = useNavigate(); navigate('/app/profile-setup/patient');
        }
      } catch (err) {
        console.error("Error al cargar el perfil del paciente:", err);
        setError("No se pudo cargar tu perfil. Intenta de nuevo más tarde.");
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // Depende del usuario logueado

  // --- Renderizado ---
  if (loading) {
    return <div className={styles.page}><div className={styles.loadingCard}>Cargando tu perfil...</div></div>;
  }
  if (error) {
     // Solo muestra error si falló la carga, no si el perfil no existe
     return <div className={styles.page}><div className={`${styles.card} ${styles.errorCard}`}>{error}</div></div>;
  }

  // Fallback para iniciales
  const fallbackInitial = user?.first_name ? user.first_name[0].toUpperCase() : 'U';
  // Usa la foto del perfil del paciente si existe Y tiene datos, si no, fallback
  const photoToShow = patientData?.photo || user?.avatar;
  const profileExists = !!patientData?.user_id; // Una forma de saber si el perfil existe

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          {/* Título */}
          <h1 className={styles.mainTitle}>Mi Perfil</h1>

          {/* Sección Cabecera */}
          <section className={styles.headerSection}>
             <div className={styles.avatar}>
               {photoToShow
                 ? <img src={photoToShow} alt="Foto de perfil" />
                 : <div className={styles.avatarFallback}>{fallbackInitial}</div>
               }
             </div>
             <div className={styles.userInfo}>
               <h2 className={styles.name}>{user?.first_name || 'Nombre'} {user?.last_name || 'Apellido'}</h2>
               <p className={styles.email}>{user?.email || 'email@ejemplo.com'}</p>
             </div>
             {/* Botón Editar/Completar */}
             <Link to="/app/profile-setup/patient" className={styles.editButton}>
               {profileExists ? 'Editar Perfil' : 'Completar Perfil'}
             </Link>
          </section>

          {/* Sección Detalles */}
          {/* Muestra los datos si el perfil existe, o un mensaje si no */}
          <section className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Detalles de Terapia</h3>
            {profileExists ? (
              <>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Fecha de Nacimiento</span>
                  <span className={styles.detailValue}>{patientData.birth_date || 'N/D'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Género</span>
                  <span className={styles.detailValue}>{patientData.gender || 'N/D'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Objetivos de Terapia</span>
                  <div className={styles.detailValueBlock}>{patientData.therapy_goals || 'No especificados'}</div>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Historial Médico Relevante</span>
                  <div className={styles.detailValueBlock}>{patientData.medical_history || 'No especificado'}</div>
                </div>
              </>
            ) : (
              <p className={styles.mutedText}>
                Aún no has completado tu perfil. Haz clic en "Completar Perfil" para añadir tus detalles.
              </p>
            )}
          </section>

          {/* (Sección Citas podría ir aquí) */}

        </div>
      </div>
    </div>
  );
}