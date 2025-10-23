// src/pages/private/PatientAppointmentsPage/PatientAppointmentsPage.jsx
import { useState, useEffect } from 'react';
// Importaremos el hook de autenticación para saber qué paciente es (si fuera necesario)
// import { useAuth } from '../../../context/AuthContext';
// Importaremos estilos
import styles from './PatientAppointmentsPage.module.css';

// Formato de fecha/hora para mostrar (puedes ajustarlo)
const DATETIME_FORMAT = {
  dateStyle: 'long', // ej: "23 de octubre de 2025"
  timeStyle: 'short', // ej: "10:30"
};

export default function PatientAppointmentsPage() {
  // const { user } = useAuth(); // Podríamos necesitar el ID del usuario para la API real
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- Simulación de carga de datos de citas ---
    setLoading(true);
    setError(null);
    console.log("Simulando carga de citas..."); // Mensaje de consola

    setTimeout(() => {
      try {
        // Datos de ejemplo (sustituir con llamada a API real)
        const mockAppointments = [
          { id: 1, psychologistName: 'Dr. García', dateTime: new Date(2025, 9, 28, 10, 30), status: 'confirmada' }, // Próxima
          { id: 2, psychologistName: 'Dra. López', dateTime: new Date(2025, 10, 5, 16, 0), status: 'confirmada' },   // Próxima
          { id: 3, psychologistName: 'Dr. García', dateTime: new Date(2025, 9, 15, 11, 0), status: 'completada' }, // Pasada
          { id: 4, psychologistName: 'Dra. Martín', dateTime: new Date(2025, 8, 20, 9, 30), status: 'completada' }, // Pasada
          // Puedes añadir citas canceladas, etc. si quieres
        ];

        const now = new Date();
        const upcoming = mockAppointments
          .filter(a => a.dateTime >= now)
          .sort((a, b) => a.dateTime - b.dateTime); // Ordenar próximas por fecha

        const past = mockAppointments
          .filter(a => a.dateTime < now)
          .sort((a, b) => b.dateTime - a.dateTime); // Ordenar pasadas por fecha (más recientes primero)

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        console.log("Citas simuladas cargadas:", { upcoming, past }); // Mensaje de consola

      } catch (err) {
        console.error("Error simulando carga de citas:", err);
        setError("No se pudieron cargar tus citas.");
        setUpcomingAppointments([]);
        setPastAppointments([]);
      } finally {
        setLoading(false);
      }
    }, 800); // Simular 0.8 segundos de carga
  }, []); // El array vacío asegura que se ejecute solo al montar

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mis Citas</h1>

      {loading && <p className={styles.loadingMessage}>Cargando citas...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && (
        <>
          {/* Sección Próximas Citas */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Próximas Citas</h2>
            {upcomingAppointments.length > 0 ? (
              <ul className={styles.appointmentsList}>
                {upcomingAppointments.map((app) => (
                  <li key={app.id} className={styles.appointmentItem}>
                    <span className={styles.dateTime}>
                      {app.dateTime.toLocaleDateString(undefined, DATETIME_FORMAT)}
                    </span>
                    <span className={styles.psychologistName}>
                      con {app.psychologistName}
                    </span>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status}
                    </span>
                    {/* Podríamos añadir botones de acción aquí (Cancelar, Reprogramar) */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noAppointmentsMessage}>No tienes próximas citas agendadas.</p>
            )}
          </section>

          {/* Sección Citas Pasadas */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Historial de Citas</h2>
            {pastAppointments.length > 0 ? (
              <ul className={styles.appointmentsList}>
                {pastAppointments.map((app) => (
                  <li key={app.id} className={`${styles.appointmentItem} ${styles.pastAppointment}`}>
                     <span className={styles.dateTime}>
                      {app.dateTime.toLocaleDateString(undefined, DATETIME_FORMAT)}
                    </span>
                    <span className={styles.psychologistName}>
                      con {app.psychologistName}
                    </span>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status}
                    </span>
                     {/* Podríamos añadir botón para ver detalles/notas si aplica */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noAppointmentsMessage}>No tienes citas en tu historial.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}