// src/pages/private/PatientAppointmentsPage/PatientAppointmentsPage.jsx
import { useState, useEffect } from "react";
import styles from "./PatientAppointmentsPage.module.css";

// ... (DATETIME_FORMAT como antes) ...
const DATETIME_FORMAT = {
  dateStyle: "long", // ej: "23 de octubre de 2025"
  timeStyle: "short", // ej: "10:30"
};

export default function PatientAppointmentsPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DATETIME_FORMAT = {
    dateStyle: "long",
    timeStyle: "short",
  };

  useEffect(() => {
    // --- Simulación de carga de datos de citas ---
    setLoading(true);
    setError(null);
    console.log("Simulando carga de citas...");

    setTimeout(() => {
      try {
        const mockAppointments = [
          {
            id: 1,
            psychologistName: "Dr. García",
            dateTime: new Date(2025, 9, 28, 10, 30),
            status: "confirmada",
          },
          {
            id: 2,
            psychologistName: "Dra. López",
            dateTime: new Date(2025, 10, 5, 16, 0),
            status: "confirmada",
          },
          {
            id: 3,
            psychologistName: "Dr. García",
            dateTime: new Date(2025, 9, 15, 11, 0),
            status: "completada",
          },
          {
            id: 4,
            psychologistName: "Dra. Martín",
            dateTime: new Date(2025, 8, 20, 9, 30),
            status: "completada",
          },
        ];

        const now = new Date();
        const upcoming = mockAppointments
          .filter((a) => a.dateTime >= now)
          .sort((a, b) => a.dateTime - b.dateTime);

        const past = mockAppointments
          .filter((a) => a.dateTime < now)
          .sort((a, b) => b.dateTime - a.dateTime);

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        console.log("Citas simuladas cargadas:", { upcoming, past });
      } catch (err) {
        console.error("Error simulando carga de citas:", err);
        setError("No se pudieron cargar tus citas.");
        setUpcomingAppointments([]);
        setPastAppointments([]);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  // --- Manejadores de Acciones (Simulados) ---
  const handleCancelAppointment = (appointmentId) => {
    // Simulación: Confirmar antes de cancelar
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      alert(`Simulación: Cancelando cita con ID ${appointmentId}...`);
      // Lógica real: Llamar a la API para cancelar
      // y luego actualizar el estado local (ej. mover a pasadas o filtrar)
      setUpcomingAppointments((prev) =>
        prev.filter((app) => app.id !== appointmentId)
      );
      // Podríamos añadirla a 'pastAppointments' con estado 'cancelada'
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    alert(
      `Simulación: Reprogramar cita con ID ${appointmentId}. (Esta función requiere más desarrollo, como mostrar un calendario)`
    );
    // Lógica real: Podría redirigir a la página del psicólogo
    // o abrir un modal con su calendario para elegir nueva fecha/hora.
  };

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
                    <div className={styles.appointmentInfo}>
                      {" "}
                      {/* Agrupar info */}
                      <span className={styles.dateTime}>
                        {app.dateTime.toLocaleString(
                          undefined,
                          DATETIME_FORMAT
                        )}
                      </span>
                      <span className={styles.psychologistName}>
                        con {app.psychologistName}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[app.status]
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    {/* 👇 Contenedor para botones de acción 👇 */}
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleRescheduleAppointment(app.id)}
                        className={`${styles.actionButton} ${styles.rescheduleButton}`}
                      >
                        Reprogramar
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(app.id)}
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                      >
                        Cancelar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noAppointmentsMessage}>
                No tienes próximas citas agendadas.
              </p>
            )}
          </section>

          {/* Sección Citas Pasadas (como antes) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Historial de Citas</h2>
            {pastAppointments.length > 0 ? (
              <ul className={styles.appointmentsList}>
                {pastAppointments.map((app) => (
                  <li
                    key={app.id}
                    className={`${styles.appointmentItem} ${styles.pastAppointment}`}
                  >
                    <span className={styles.dateTime}>
                      {app.dateTime.toLocaleString(undefined, DATETIME_FORMAT)}{" "}
                    </span>
                    <span className={styles.psychologistName}>
                      con {app.psychologistName}
                    </span>
                    <span
                      className={`${styles.statusBadge} ${styles[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noAppointmentsMessage}>
                No tienes citas en tu historial.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
