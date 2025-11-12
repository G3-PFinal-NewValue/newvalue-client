// src/pages/private/PatientAppointmentsPage/PatientAppointmentsPage.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./PatientAppointmentsPage.module.css";
import {
  getMyAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getBookedSlotsForPsychologist,
} from "../../../services/appointmentService";
import { getPsychologistProfileById } from "../../../services/psychologistsService";
import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";
import Swal from 'sweetalert2';

export default function PatientAppointmentsPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    appointment: null,
    slots: [],
    loading: false,
    error: null,
  });

  const DATETIME_FORMAT = {
    dateStyle: "long",
    timeStyle: "short",
  };

  const SLOT_DURATION = 45;

  const normalizeBookedSlots = (booked = []) =>
    booked.map((slot) => {
      const start = new Date(slot.date);
      const end = new Date(
        start.getTime() + (slot.duration_minutes || SLOT_DURATION) * 60000
      );
      return { start, end };
    });

  const createSlotsForDate = (
    availability,
    baseDate,
    bookedSlots,
    now = new Date()
  ) => {
    const [startHour, startMinute] = (availability.start_time || "00:00")
      .split(":")
      .map(Number);
    const [endHour, endMinute] = (availability.end_time || "00:00")
      .split(":")
      .map(Number);

    if (
      [startHour, startMinute, endHour, endMinute].some((value) =>
        Number.isNaN(value)
      )
    ) {
      return [];
    }

    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMinute, 0, 0);
    const endDate = new Date(baseDate);
    endDate.setHours(endHour, endMinute, 0, 0);

    const slots = [];
    let slotStart = new Date(startDate);

    while (slotStart < endDate) {
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60000);

      if (slotEnd <= now) {
        slotStart = slotEnd;
        continue;
      }
      if (slotEnd > endDate) break;

      const overlaps = bookedSlots.some(
        (booked) => slotStart < booked.end && slotEnd > booked.start
      );
      if (!overlaps) {
        slots.push({
          availabilityId: availability.id,
          start: new Date(slotStart),
          end: new Date(slotEnd),
          label: slotStart.toLocaleString(undefined, DATETIME_FORMAT),
        });
      }
      slotStart = slotEnd;
    }
    return slots;
  };

  const generateAvailableSlots = (profile, bookedSlots) => {
    if (!profile?.availabilities) return [];
    const now = new Date();
    const limit = addDays(now, 28);
    const startCursor = startOfDay(now);
    const normalizedBooked = normalizeBookedSlots(bookedSlots);
    const slots = [];

    profile.availabilities.forEach((availability) => {
      if (!availability?.is_available) return;

      if (availability.specific_date) {
        const baseDate = startOfDay(
          new Date(`${availability.specific_date}T00:00:00`)
        );
        if (baseDate >= now) {
          slots.push(
            ...createSlotsForDate(
              availability,
              baseDate,
              normalizedBooked,
              now
            )
          );
        }
        return;
      }

      let cursor = new Date(startCursor);
      while (cursor <= limit) {
        const jsDay = cursor.getDay() === 0 ? 7 : cursor.getDay();
        if (availability.weekday === jsDay) {
          slots.push(
            ...createSlotsForDate(
              availability,
              cursor,
              normalizedBooked,
              now
            )
          );
        }
        cursor = addDays(cursor, 1);
      }
    });

    return slots.sort((a, b) => a.start - b.start);
  };

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAppointments();
      const allAppointments = data.appointments || [];

      const normalizeStatus = (status) => {
        const normalized = (status || "").toLowerCase();
        if (normalized === "confirmed") return "confirmada";
        if (normalized === "pending") return "pendiente";
        if (normalized === "completed") return "completada";
        if (normalized === "cancelled") return "cancelada";
        return normalized || "sin estado";
      };

      const isConfirmedStatus = (status) =>
        ["confirmed", "confirmada"].includes((status || "").toLowerCase());
      const isPendingStatus = (status) =>
        ["pending", "pendiente"].includes((status || "").toLowerCase());

      const parsedAppointments = allAppointments.map((app) => ({
        id: app.id,
        psychologistName: app.psychologist
          ? `${app.psychologist.first_name} ${app.psychologist.last_name}`
          : "Psicólogo no asignado",
        dateTime: new Date(app.date),
        statusRaw: app.status,
        statusLabel: normalizeStatus(app.status),
        isConfirmed: isConfirmedStatus(app.status),
        isPending: isPendingStatus(app.status),
        psychologistId: app.psychologist_id,
      }));

      const now = new Date();
      const upcoming = parsedAppointments
        .filter(
          (a) =>
            a.dateTime >= now &&
            (a.isConfirmed || a.isPending)
        )
        .sort((a, b) => a.dateTime - b.dateTime);

      const past = parsedAppointments
        .filter(
          (a) =>
            a.dateTime < now ||
            ["completada", "completed", "cancelled", "cancelada"].includes(
              (a.statusRaw || "").toLowerCase()
            )
        )
        .sort((a, b) => b.dateTime - a.dateTime);

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (err) {
      console.error("Error cargando citas:", err);
      setError("No se pudieron cargar tus citas.");
      setUpcomingAppointments([]);
      setPastAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCallWindow = (appointmentId) => {
    if (!appointmentId) return;
    window.open(`/consulta/${appointmentId}`, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Cancelar cita?',
      text: '¿Estás seguro de que quieres cancelar esta cita?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (!result.isConfirmed) return;
    try {
      await cancelAppointment(appointmentId);
      await loadAppointments();
      Swal.fire({
        icon: 'success',
        title: '¡Cancelada!',
        text: 'Cita cancelada correctamente',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar la cita. Inténtalo de nuevo.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleRescheduleAppointment = async (appointment) => {
    if (!appointment?.psychologistId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede reprogramar esta cita.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    setRescheduleModal({
      open: true,
      appointment,
      slots: [],
      loading: true,
      error: null,
    });

    try {
      const [profile, booked] = await Promise.all([
        getPsychologistProfileById(appointment.psychologistId),
        getBookedSlotsForPsychologist(appointment.psychologistId),
      ]);
      const slots = generateAvailableSlots(profile, booked);
      setRescheduleModal((prev) => ({
        ...prev,
        slots,
        loading: false,
        error:
          slots.length === 0
            ? "No hay horarios disponibles para reprogramar."
            : null,
      }));
    } catch (err) {
      console.error("Error cargando horarios:", err);
      setRescheduleModal((prev) => ({
        ...prev,
        loading: false,
        error: "No se pudieron cargar los horarios disponibles.",
      }));
    }
  };

  const handleSelectNewSlot = async (slot) => {
    if (!slot || !rescheduleModal.appointment) return;

    const readableSlot = slot.start.toLocaleString(undefined, DATETIME_FORMAT); // CA: informar fecha amigable
    const result = await Swal.fire({
      icon: 'question',
      title: 'Confirmar reprogramación',
      html: `¿Confirmas reprogramar la cita para<br><strong>${readableSlot}</strong>?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280'
    });

    if (!result.isConfirmed) return;

    try {
      setRescheduleModal((prev) => ({ ...prev, loading: true, error: null }));
      await rescheduleAppointment(rescheduleModal.appointment.id, {
        availability_id: slot.availabilityId,
        date: slot.start.toISOString(),
        duration_minutes: SLOT_DURATION,
      });
      setRescheduleModal({
        open: false,
        appointment: null,
        slots: [],
        loading: false,
        error: null,
      });
      await loadAppointments();
      Swal.fire({
        icon: 'success',
        title: '¡Reprogramada!',
        text: 'Cita reprogramada correctamente',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
    } catch (err) {
      console.error("Error al reprogramar:", err);
      setRescheduleModal((prev) => ({
        ...prev,
        loading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo reprogramar la cita.",
      }));
      Swal.fire({
        icon: 'error',
        title: 'Error al reprogramar',
        text: err?.response?.data?.message || err?.message || "No se pudo reprogramar la cita.",
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({
      open: false,
      appointment: null,
      slots: [],
      loading: false,
      error: null,
    });
  };

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
                          styles[app.statusLabel.replace(/\s+/g, "")]
                        }`}
                      >
                        {app.statusLabel}
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      {app.isConfirmed && (
                        <button
                          onClick={() => openCallWindow(app.id)}
                          className={`${styles.actionButton} ${styles.joinButton}`}
                        >
                          Entrar a la consulta
                        </button>
                      )}
                      <button
                        onClick={() => handleRescheduleAppointment(app)}
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
                          styles[app.statusLabel.replace(/\s+/g, "")]
                        }`}
                      >
                        {app.statusLabel}
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

      {rescheduleModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Reprogramar cita</h3>
            <p className={styles.modalSubtitle}>
              Selecciona uno de los horarios disponibles para{" "}
              {rescheduleModal.appointment?.psychologistName}.
            </p>

            {rescheduleModal.loading && <p>Cargando horarios...</p>}

            {!rescheduleModal.loading && rescheduleModal.error && (
              <p className={styles.errorMessage}>{rescheduleModal.error}</p>
            )}

            {!rescheduleModal.loading &&
              !rescheduleModal.error &&
              rescheduleModal.slots.length > 0 && (
                <div className={styles.slotList}>
                  {rescheduleModal.slots.map((slot) => (
                    <button
                      key={`${slot.availabilityId}-${slot.start.toISOString()}`}
                      onClick={() => handleSelectNewSlot(slot)}
                      className={styles.slotButton}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}

            {!rescheduleModal.loading &&
              !rescheduleModal.error &&
              rescheduleModal.slots.length === 0 && (
                <p className={styles.noAppointmentsMessage}>
                  No hay horarios disponibles en este momento.
                </p>
              )}

            <div className={styles.modalActions}>
              <button
                onClick={closeRescheduleModal}
                className={styles.cancelButton}
                type="button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
