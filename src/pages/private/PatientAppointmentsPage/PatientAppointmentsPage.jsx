// src/pages/private/PatientAppointmentsPage/PatientAppointmentsPage.jsx
import { useState, useEffect } from "react";
import styles from "./PatientAppointmentsPage.module.css";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../../services/appointmentService";

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
    setLoading(true);
    setError(null);
    console.log("Cargando citas reales...");

    getMyAppointments()
      .then((data) => {
        // El backend devuelve un objeto { appointments: [...] }
        const allAppointments = data.appointments || [];

        // Parsear los datos reales
        const parsedAppointments = allAppointments.map((app) => ({
          id: app.id,
          // El backend envía el objeto 'psychologist' anidado
          psychologistName: app.psychologist
            ? `${app.psychologist.first_name} ${app.psychologist.last_name}`
            : "Psicólogo no asignado",
          // El backend envía 'date' como un string ISO (ej: "2025-10-28T10:30:00.000Z")
          dateTime: new Date(app.date),
          status: app.status,
        }));

        // La lógica de filtrado se mantiene, pero ahora usa los datos parseados
        const now = new Date();
        const upcoming = parsedAppointments
          .filter(
            (a) =>
              a.dateTime >= now &&
              (a.status === "confirmada" || a.status === "pending")
          )
          .sort((a, b) => a.dateTime - b.dateTime);

        const past = parsedAppointments
          .filter(
            (a) =>
              a.dateTime < now ||
              a.status === "completada" ||
              a.status === "cancelled"
          )
          .sort((a, b) => b.dateTime - a.dateTime);

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        console.log("Citas reales cargadas:", { upcoming, past });
      })
      .catch((err) => {
        console.error("Error cargando citas:", err);
        setError("No se pudieron cargar tus citas.");
        setUpcomingAppointments([]);
        setPastAppointments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log("Cargando citas reales...");

    getMyAppointments()
      .then((data) => {
        // El backend devuelve un objeto { appointments: [...] }
        const allAppointments = data.appointments || [];

        // Parsear los datos reales
        const parsedAppointments = allAppointments.map((app) => ({
          id: app.id,
          // El backend envía el objeto 'psychologist' anidado
          psychologistName: app.psychologist
            ? `${app.psychologist.first_name} ${app.psychologist.last_name}`
            : "Psicólogo no asignado",
          // El backend envía 'date' como un string ISO (ej: "2025-10-28T10:30:00.000Z")
          dateTime: new Date(app.date),
          status: app.status,
        }));

        // La lógica de filtrado se mantiene, pero ahora usa los datos parseados
        const now = new Date();
        const upcoming = parsedAppointments
          .filter(
            (a) =>
              a.dateTime >= now &&
              (a.status === "confirmada" || a.status === "pending")
          )
          .sort((a, b) => a.dateTime - b.dateTime);

        const past = parsedAppointments
          .filter(
            (a) =>
              a.dateTime < now ||
              a.status === "completada" ||
              a.status === "cancelled"
          )
          .sort((a, b) => b.dateTime - a.dateTime);

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        console.log("Citas reales cargadas:", { upcoming, past });
      })
      .catch((err) => {
        console.error("Error cargando citas:", err);
        setError("No se pudieron cargar tus citas.");
        setUpcomingAppointments([]);
        setPastAppointments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* ... (El JSX de 'return' se mantiene exactamente igual) ... */}
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
                    <div className={styles.appointmentInfo}>
                      {" "}
                      {/* Añadido div para consistencia */}
                      <span className={styles.dateTime}>
                        {app.dateTime.toLocaleString(
                          undefined,
                          DATETIME_FORMAT
                        )}{" "}
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
