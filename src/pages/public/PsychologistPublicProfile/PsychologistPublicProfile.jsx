import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPsychologistProfileById } from "../../../services/psychologistsService";
import { getBookedSlotsForPsychologist, createAppointment } from "../../../services/appointmentService";
import { useAuth } from "../../../context/AuthContext";
import styles from "./PsychologistPublicProfile.module.css";

// Importaciones de react-big-calendar y date-fns
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
// import addHours from "date-fns/addHours"; // No se usa directamente
import addMinutes from "date-fns/addMinutes";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import setSeconds from "date-fns/setSeconds";
// --- CAMBIO: Importaciones añadidas ---
import startOfDay from "date-fns/startOfDay";
// --- FIN CAMBIO ---
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Lunes como inicio de semana
  getDay,
  locales,
});

const parseTime = (timeStr) => {
  if (!timeStr || !timeStr.includes(":")) return { hours: 0, minutes: 0 }; // Manejo defensivo
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

export default function PsychologistPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  // Nuevo estado para controlar la fecha actual del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Estados para el modal de reserva
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      setLoading(true);
      try {
        const profilePromise = getPsychologistProfileById(id);
        const bookingsPromise = getBookedSlotsForPsychologist(id);

        const [profileData, bookingsData] = await Promise.all([
          profilePromise,
          bookingsPromise,
        ]);

        setProfile(profileData || null);
        setBookedAppointments(bookingsData || []);
      } catch (error) {
        console.error("Error cargando el perfil o las citas:", error);
        setProfile(null);
        setBookedAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndBookings();
  }, [id]);

  // --- CAMBIO: Definir límites de fecha y hora con useMemo ---
  // Memoizamos 'today' para que solo se calcule una vez por carga
  const today = useMemo(() => new Date(), []);
  
  // Límite de FECHA mínima: Hoy
  const minNavigationDate = useMemo(() => startOfDay(today), [today]);
  
  // Límite de FECHA máxima: 28 días desde hoy
  const maxNavigationDate = useMemo(() => startOfDay(addDays(today, 28)), [today]);

  // Límites de HORA para el calendario (8:00 AM - 22:00 PM)
  const minTime = useMemo(() => setHours(setMinutes(new Date(), 0), 8), []);
  const maxTime = useMemo(() => setHours(setMinutes(new Date(), 0), 22), []);
  // --- FIN CAMBIO ---
  
  const calendarEvents = useMemo(() => {
    if (!profile?.availabilities) return [];

    const events = [];
    // Usamos minNavigationDate como punto de partida (hoy a las 00:00)
    const startOfToday = minNavigationDate; 
    // Usamos maxNavigationDate como límite (28 días desde hoy)
    const futureLimit = maxNavigationDate; 

    const realBookedSlots = bookedAppointments.map((app) => {
      const startDate = new Date(app.date); // El backend envía un string ISO
      const endDate = addMinutes(startDate, app.duration_minutes || 60);
      return { start: startDate, end: endDate };
    });

    let currentDate = startOfToday;
    while (currentDate < futureLimit) {
      const jsDay = getDay(currentDate); // 0=Domingo, 1=Lunes,...
      // Convertimos el día de JS (0=Dom) al formato de BD (7=Dom)
      const dbWeekday = jsDay === 0 ? 7 : jsDay;
      
      const dayAvailabilities = profile.availabilities.filter(
        (a) => a.weekday === dbWeekday // Lógica de filtro restaurada
      );
      
      dayAvailabilities.forEach((availability) => {
        // Lógica de parseTime restaurada
        const { hours: startHour, minutes: startMinute } = parseTime(
          availability.start_time
        );
        const { hours: endHour, minutes: endMinute } = parseTime(
          availability.end_time
        );

        // Lógica de isNaN restaurada
        if (
          isNaN(startHour) ||
          isNaN(startMinute) ||
          isNaN(endHour) ||
          isNaN(endMinute)
        )
          return;

        // Lógica de slotStart restaurada
        let slotStart = setSeconds(
          setMinutes(setHours(currentDate, startHour), startMinute),
          0
        );
        // Lógica de slotEndLimit restaurada
        const slotEndLimit = setSeconds(
          setMinutes(setHours(currentDate, endHour), endMinute),
          0
        );

        const slotDuration = 45; 

        while (slotStart < slotEndLimit) {
          const slotEnd = addMinutes(slotStart, slotDuration); 

          // Comparamos contra 'today' (que tiene la hora actual)
          if (slotEnd <= today) { 
            slotStart = slotEnd;
            continue;
          }
          
          if (slotEnd > slotEndLimit) {
            break;
          }

          // Lógica de isBooked restaurada
          const isBooked = realBookedSlots.some(
            (booked) =>
              slotStart < booked.end && slotEnd > booked.start
          );

          // Lógica de push restaurada
          events.push({
            title: isBooked ? "Reservado" : "Disponible",
            start: slotStart,
            end: slotEnd,
            isAvailable: !isBooked,
            resourceId: profile.id, 
          });

          slotStart = slotEnd; 
        }
      });
      currentDate = addDays(currentDate, 1);
    }
    return events;
  }, [profile, bookedAppointments, minNavigationDate, maxNavigationDate, today]); 

  // --- Manejador de clics en slots ---
  const handleSlotSelect = (event) => {
    if (!event.isAvailable) {
      alert("Este horario ya está reservado.");
      return;
    }

    // Verificar que el usuario esté logueado
    if (!user) {
      alert("Debes iniciar sesión para reservar una cita.");
      navigate("/login");
      return;
    }

    // Verificar que el usuario sea un paciente
    if (user.role !== "patient") {
      alert("Solo los pacientes pueden reservar citas.");
      return;
    }

    // Mostrar modal de confirmación
    setSelectedSlot(event);
    setShowBookingModal(true);
  };

  // --- Función para confirmar la reserva ---
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return;

    setBookingLoading(true);
    try {
      const appointmentData = {
        patient_id: user.id,
        psychologist_id: profile.user_id,
        date: selectedSlot.start.toISOString(),
        duration_minutes: 45, // Duración fija de 45 minutos
        status: "pending"
      };

      await createAppointment(appointmentData);
      
      // Actualizar las citas reservadas
      const updatedBookings = await getBookedSlotsForPsychologist(id);
      setBookedAppointments(updatedBookings || []);
      
      // Cerrar modal y mostrar mensaje de éxito
      setShowBookingModal(false);
      setSelectedSlot(null);
      alert("¡Cita reservada exitosamente! Te contactaremos pronto para confirmar.");
      
    } catch (error) {
      console.error("Error al reservar la cita:", error);
      alert("Error al reservar la cita. Por favor, inténtalo de nuevo.");
    } finally {
      setBookingLoading(false);
    }
  };

  // --- Función para cancelar la reserva ---
  const handleCancelBooking = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  // --- Manejador de navegación del calendario ---
  const handleNavigate = (newDate) => {
    // Verificar que la fecha esté dentro de los límites
    if (newDate >= minNavigationDate && newDate <= maxNavigationDate) {
      setCurrentDate(newDate);
    }
  };

  // --- Estilo visual de los eventos ---
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: event.isAvailable
        ? "var(--color-brand-secondary)" // Verde
        : "#e0e0e0", // Gris más claro para reservado
      borderRadius: "5px",
      opacity: event.isAvailable ? 0.9 : 0.7,
      color: event.isAvailable ? "white" : "#757575", // Texto gris oscuro para reservado
      border: "none",
      cursor: event.isAvailable ? "pointer" : "not-allowed",
      fontSize: "13px",
      padding: "2px 5px",
    };
    return { style };
  };

  // --- Renderizado (Loading, Not Found) ---
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.section}>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }
  if (profile === null) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.section}>
            <p>Perfil no encontrado.</p>
            <div className={styles.footerActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
              <Link className={styles.primaryBtn} to="/">
                Ir al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Renderizado del Perfil + Calendario ---
  const {
    photo,
    license_number,
    specialities,
    professional_description,
    user_id,
    user: psychologistUser,
  } = profile;

  const psychologistName =
    psychologistUser?.first_name && psychologistUser?.last_name
      ? `${psychologistUser.first_name} ${psychologistUser.last_name}`
      : `Psicólogo/a #${user_id ?? "N/D"}`;

  const fallbackInitial = psychologistUser?.first_name
    ? psychologistUser.first_name[0].toUpperCase()
    : "P";

  const photoToShow = photo || psychologistUser?.avatar;

  const specialtiesText =
    specialities && specialities.length > 0
      ? specialities.map((s) => s.name).join(", ")
      : "Especialidad no especificada";

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* --- Cabecera --- */}
        <div className={styles.headerCard}>
          <div className={styles.avatar}>
            {photoToShow ? ( 
              <img src={photoToShow} alt={`Foto de ${psychologistName}`} />
            ) : (
              <div className={styles.avatarFallback}>{fallbackInitial}</div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>
              {psychologistName} 
            </h1>
            <p className={styles.specialty}>{specialtiesText}</p>
            <p className={styles.license}>
              Licencia: {license_number || "N/D"}
            </p>
          </div>
        </div>

        {/* --- Grid: Sobre mí y Calendario --- */}
        <div className={styles.grid}>
          {/* Sección "Sobre mí" */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre mí</h2>
            <p className={styles.description}>
              {professional_description ||
                "Este profesional aún no ha añadido su descripción."}
            </p>
          </section>

          {/* Sección del Calendario */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Agenda tu cita</h2>
            {calendarEvents.length === 0 && !loading ? (
              <p className={styles.muted}>
                Este profesional no tiene horarios disponibles publicados en las
                próximas 4 semanas.
              </p>
            ) : (
              <div
                className={styles.calendarContainer}
                style={{ height: "65vh", minHeight: "550px" }}
              >
                {" "}
                <Calendar
                  localizer={localizer}
                  culture="es"
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView={Views.WEEK}
                  views={[Views.WEEK, Views.DAY]}
                  selectable={false} 
                  onSelectEvent={handleSlotSelect} 
                  eventPropGetter={eventPropGetter}
                  
                  // --- Propiedades para controlar la navegación ---
                  date={currentDate}
                  onNavigate={handleNavigate}
                  
                  // --- Corrección de min/max para limitar horas del día ---
                  min={minTime} 
                  max={maxTime} 
                  // --- scrollToTime para iniciar en las 8:00 AM ---
                  scrollToTime={minTime}

                  step={15} 
                  timeslots={4} 
                  messages={{
                    next: "Sig >",
                    previous: "< Ant",
                    today: "Hoy",
                    week: "Semana",
                    day: "Día",
                    month: "Mes",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange:
                      "No hay horarios disponibles en esta vista.",
                    showMore: (total) => `+ ${total} más`,
                  }}
                  formats={{
                    timeGutterFormat: (date, culture, localizer) =>
                      localizer.format(date, "H:mm", culture), 
                    eventTimeRangeFormat: (
                      { start, end },
                      culture,
                      localizer
                    ) =>
                      localizer.format(start, "H:mm", culture) +
                      " - " +
                      localizer.format(end, "H:mm", culture),
                  }}
                  dayLayoutAlgorithm="no-overlap"
                />
              </div>
            )}
          </section>
        </div>

        {/* --- Acciones Footer --- */}
        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} to="/">
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* --- Modal de Confirmación de Reserva --- */}
      {showBookingModal && selectedSlot && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Reserva de Cita</h3>
            <div className={styles.modalContent}>
              <p><strong>Psicólogo:</strong> {psychologistName}</p>
              <p><strong>Fecha y hora:</strong> {format(selectedSlot.start, "PPPP 'a las' p", { locale: es })}</p>
              <p><strong>Duración:</strong> 45 minutos</p>
              <p className={styles.modalNote}>
                Una vez confirmada, recibirás información de contacto para coordinar los detalles de la sesión.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryBtn} 
                onClick={handleCancelBooking}
                disabled={bookingLoading}
              >
                Cancelar
              </button>
              <button 
                className={styles.primaryBtn} 
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Reservando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

