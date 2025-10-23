// src/pages/private/PsychologistDashboardPage/PsychologistDashboardPage.jsx
import { useState, useEffect } from 'react';
// import { useAuth } from '../../../context/AuthContext'; // Para obtener ID del psicólogo
import styles from './PsychologistDashboardPage.module.css';

// Formato de fecha/hora (igual que en PatientAppointmentsPage)
const DATETIME_FORMAT = {
  dateStyle: 'long',
  timeStyle: 'short',
};

export default function PsychologistDashboardPage() {
  // const { user } = useAuth(); // Para filtrar por psychologist_id en la API real
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]); // Placeholder para lista de pacientes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- Simulación de carga de datos para el dashboard del psicólogo ---
    setLoading(true);
    setError(null);
    console.log("Simulando carga de datos del dashboard del psicólogo...");

    setTimeout(() => {
      try {
        // Datos de ejemplo (sustituir con llamadas a API)
        const mockPsychologistAppointments = [
          // Citas asociadas a este psicólogo (ej. ID 102)
          { id: 1, patientName: 'Ana García', dateTime: new Date(2025, 9, 28, 10, 30), status: 'confirmada' },
          { id: 5, patientName: 'Pedro Martín', dateTime: new Date(2025, 9, 28, 11, 30), status: 'confirmada' },
          { id: 6, patientName: 'Sofía Reyes', dateTime: new Date(2025, 9, 29, 15, 0), status: 'confirmada' },
          { id: 3, patientName: 'Ana García', dateTime: new Date(2025, 9, 15, 11, 0), status: 'completada' }, // Pasada
        ];

        // Placeholder para pacientes asociados
        const mockPsychologistPatients = [
            { id: 101, name: 'Ana García', lastAppointment: new Date(2025, 9, 28, 10, 30)},
            { id: 104, name: 'Pedro Martín', lastAppointment: new Date(2025, 9, 28, 11, 30)},
            { id: 105, name: 'Sofía Reyes', lastAppointment: new Date(2025, 9, 29, 15, 0)},
        ];

        // Filtrar solo próximas citas para la agenda principal
        const now = new Date();
        const upcoming = mockPsychologistAppointments
          .filter(a => a.dateTime >= now && a.status === 'confirmada') // Solo confirmadas y futuras
          .sort((a, b) => a.dateTime - b.dateTime); // Ordenar

        setAppointments(upcoming);
        setPatients(mockPsychologistPatients); // Guardar pacientes mock
        console.log("Datos simulados cargados:", { upcomingAppointments: upcoming, patients: mockPsychologistPatients });

      } catch (err) {
        console.error("Error simulando carga de datos del dashboard:", err);
        setError("No se pudieron cargar los datos del dashboard.");
        setAppointments([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }, 900); // Simular ~0.9 segundos de carga
  }, []); // [] para que se ejecute solo al montar

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mi Panel Profesional</h1>

      {loading && <p className={styles.loadingMessage}>Cargando panel...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && (
        <div className={styles.dashboardGrid}> {/* Usaremos grid para layout */}

          {/* Sección Próximas Citas */}
          <section className={`${styles.section} ${styles.agendaSection}`}>
            <h2 className={styles.sectionTitle}>Próximas Citas</h2>
            {appointments.length > 0 ? (
              <ul className={styles.appointmentsList}>
                {appointments.map((app) => (
                  <li key={app.id} className={styles.appointmentItem}>
                    <span className={styles.dateTime}>
                      {app.dateTime.toLocaleString(undefined, DATETIME_FORMAT)}
                    </span>
                    <span className={styles.patientName}>
                      con {app.patientName}
                    </span>
                    {/* Podríamos añadir un botón para ir a la sesión/detalles */}
                    {/* <button className={styles.detailsButton}>Ver</button> */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyMessage}>No tienes próximas citas agendadas.</p>
            )}
          </section>

          {/* Sección Mis Pacientes (Placeholder) */}
          <section className={`${styles.section} ${styles.patientsSection}`}>
            <h2 className={styles.sectionTitle}>Mis Pacientes ({patients.length})</h2>
             {patients.length > 0 ? (
                 <ul className={styles.patientsList}>
                    {patients.map((patient) => (
                        <li key={patient.id} className={styles.patientItem}>
                            <span className={styles.patientName}>{patient.name}</span>
                            {/* Podríamos mostrar última cita o un botón para ver ficha */}
                            {/* <span className={styles.lastAppointment}>Última cita: {patient.lastAppointment.toLocaleDateString()}</span> */}
                            {/* <button className={styles.detailsButton}>Ver Ficha</button> */}
                        </li>
                    ))}
                 </ul>
             ) : (
                <p className={styles.emptyMessage}>Aún no tienes pacientes asignados.</p>
             )}
          </section>

           {/* Podríamos añadir más secciones: Estadísticas, Editar Disponibilidad, etc. */}

        </div>
      )}
    </div>
  );
}