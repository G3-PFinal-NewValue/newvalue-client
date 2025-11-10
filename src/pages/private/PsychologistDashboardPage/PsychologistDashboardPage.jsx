// src/pages/private/PsychologistDashboardPage/PsychologistDashboardPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getPsychologistAppointments,
  confirmAppointment,
  rejectAppointment,
} from "../../../services/appointmentService";
import { getPatientsByPsychologist } from "../../../services/patientService";
import styles from "./PsychologistDashboardPage.module.css";

export default function PsychologistDashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAppointment, setProcessingAppointment] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const psychologistId = user.id;
        const [appointmentsData, patientsData] = await Promise.allSettled([
          getPsychologistAppointments(psychologistId),
          getPatientsByPsychologist(psychologistId),
        ]);

        // Procesar citas
        if (appointmentsData.status === "fulfilled") {
          const allAppointments = appointmentsData.value || [];

          // Separar citas por estado
          const now = new Date();
          const pendingAppointments = allAppointments
            .filter(
              (app) => app.status === "pending" && new Date(app.date) > now
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          const confirmedAppointments = allAppointments
            .filter(
              (app) => app.status === "confirmed" && new Date(app.date) > now
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          setAppointments({
            pending: pendingAppointments,
            confirmed: confirmedAppointments,
          });
        } else {
          console.error("Error cargando citas:", appointmentsData.reason);
          setAppointments({ pending: [], confirmed: [] });
        }

        // Procesar pacientes
        if (patientsData.status === "fulfilled") {
          const formattedPatients = (patientsData.value || []).map(
            (patient) => ({
              id: patient.user_id || patient.id,
              firstName:
                patient.user?.first_name ||
                patient.first_name ||
                "Paciente",
              lastName:
                patient.user?.last_name || patient.last_name || "",
              email: patient.user?.email || patient.email || "Sin correo",
            })
          );
          setPatients(formattedPatients);
        } else {
          console.error("Error cargando pacientes:", patientsData.reason);
          setPatients([]);
        }
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setError("No se pudieron cargar los datos del dashboard.");
        setAppointments({ pending: [], confirmed: [] });
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const handleConfirmAppointment = async (appointmentId) => {
    setProcessingAppointment(appointmentId);
    try {
      await confirmAppointment(appointmentId);

      // Actualizar las listas localmente
      setAppointments((prev) => {
        const appointmentToConfirm = prev.pending.find(
          (app) => app.id === appointmentId
        );
        if (!appointmentToConfirm) return prev;

        return {
          pending: prev.pending.filter((app) => app.id !== appointmentId),
          confirmed: [
            ...prev.confirmed,
            { ...appointmentToConfirm, status: "confirmed" },
          ].sort((a, b) => new Date(a.date) - new Date(b.date)),
        };
      });

      alert("Cita confirmada exitosamente");
    } catch (error) {
      console.error("Error al confirmar cita:", error);
      alert("Error al confirmar la cita. Inténtalo de nuevo.");
    } finally {
      setProcessingAppointment(null);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    if (!confirm("¿Estás seguro de que quieres rechazar esta cita?")) return;

    setProcessingAppointment(appointmentId);
    try {
      await rejectAppointment(appointmentId);

      // Remover de las listas localmente
      setAppointments((prev) => ({
        pending: prev.pending.filter((app) => app.id !== appointmentId),
        confirmed: prev.confirmed.filter((app) => app.id !== appointmentId),
      }));

      alert("Cita rechazada");
    } catch (error) {
      console.error("Error al rechazar cita:", error);
      alert("Error al rechazar la cita. Inténtalo de nuevo.");
    } finally {
      setProcessingAppointment(null);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPatientName = (appointment) => {
    if (appointment.patient) {
      return `${appointment.patient.first_name} ${appointment.patient.last_name}`;
    }
    return `Paciente #${appointment.patient_id}`;
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p className={styles.loadingMessage}>Cargando panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mi Panel Profesional</h1>

      <div className={styles.dashboardGrid}>
        {/* Sección Citas Pendientes */}
        <section className={`${styles.section} ${styles.pendingSection}`}>
          <h2 className={styles.sectionTitle}>
            Citas Pendientes de Confirmación (
            {appointments.pending?.length || 0})
          </h2>
          {appointments.pending?.length > 0 ? (
            <ul className={styles.appointmentsList}>
              {appointments.pending.map((app) => (
                <li key={app.id} className={styles.appointmentItem}>
                  <div className={styles.appointmentInfo}>
                    <span className={styles.dateTime}>
                      {formatDateTime(app.date)}
                    </span>
                    <span className={styles.patientName}>
                      {getPatientName(app)}
                    </span>
                    <span className={styles.duration}>
                      Duración: {app.duration_minutes || 45} minutos
                    </span>
                  </div>
                  <div className={styles.appointmentActions}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => handleConfirmAppointment(app.id)}
                      disabled={processingAppointment === app.id}
                    >
                      {processingAppointment === app.id
                        ? "Confirmando..."
                        : "Confirmar"}
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleRejectAppointment(app.id)}
                      disabled={processingAppointment === app.id}
                    >
                      {processingAppointment === app.id
                        ? "Rechazando..."
                        : "Rechazar"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>
              No tienes citas pendientes de confirmación.
            </p>
          )}
        </section>

        {/* Sección Próximas Citas Confirmadas */}
        <section className={`${styles.section} ${styles.agendaSection}`}>
          <h2 className={styles.sectionTitle}>
            Próximas Citas Confirmadas ({appointments.confirmed?.length || 0})
          </h2>
          {appointments.confirmed?.length > 0 ? (
            <ul className={styles.appointmentsList}>
              {appointments.confirmed.map((app) => (
                <li key={app.id} className={styles.appointmentItem}>
                  <div className={styles.appointmentInfo}>
                    <span className={styles.dateTime}>
                      {formatDateTime(app.date)}
                    </span>
                    <span className={styles.patientName}>
                      {getPatientName(app)}
                    </span>
                    <span className={styles.status}>✅ Confirmada</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>
              No tienes próximas citas confirmadas.
            </p>
          )}
        </section>

        {/* Sección Mis Pacientes */}
        <section className={`${styles.section} ${styles.patientsSection}`}>
          <h2 className={styles.sectionTitle}>
            Mis Pacientes ({patients.length})
          </h2>
          {patients.length > 0 ? (
            <ul className={styles.patientsList}>
              {patients.map((patient) => (
                <li
                  key={patient.id || `${patient.firstName}-${patient.email}`}
                  className={styles.patientItem}
                >
                  <span className={styles.patientName}>
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className={styles.patientEmail}>{patient.email}</span>
                  <Link
                    to={`/app/patients/${patient.id}`}
                    className={styles.patientLink}
                  >
                    Ver perfil
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>
              Aún no tienes pacientes asignados.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
