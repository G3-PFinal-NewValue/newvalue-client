import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPsychologistProfileById } from "../../../services/psychologistsService";
import styles from "./PsychologistPublicProfile.module.css";

// 1. Importaciones de react-big-calendar y date-fns
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import isWithinInterval from 'date-fns/isWithinInterval';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';
import es from 'date-fns/locale/es'; // Para ponerlo en español
import "react-big-calendar/lib/css/react-big-calendar.css";

// 2. Configuración del localizador para date-fns en español
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }), // Lunes como inicio de semana
  getDay,
  locales,
});

// Helper para parsear "HH:MM" a [horas, minutos]
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

// --- Componente ---
export default function PsychologistPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Carga del perfil (como antes) ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const p = await getPsychologistProfileById(id);
        setProfile(p || null);
      } catch (error) {
        console.error("Error cargando el perfil:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // --- 3. Lógica para generar los eventos del calendario ---
  const calendarEvents = useMemo(() => {
    if (!profile?.availabilities) return [];

    const events = [];
    const today = new Date();
    const futureLimit = addDays(today, 28); // Generar slots para las próximas 4 semanas

    // ⚠️ SIMULACIÓN DE CITAS RESERVADAS (Reemplazar con llamada a API)
    const mockBookedAppointments = [
      { start: setHours(addDays(today, 2), 10), end: setHours(addDays(today, 2), 11) }, // Ej: Cita reservada en 2 días a las 10:00
      { start: setHours(addDays(today, 3), 15), end: setHours(addDays(today, 3), 16) }, // Ej: Cita reservada en 3 días a las 15:00
    ];
    // Fin de la simulación

    // Iterar día por día hasta el límite futuro
    let currentDate = today;
    while (currentDate < futureLimit) {
      const currentDayOfWeek = getDay(currentDate); // 0=Domingo, 1=Lunes,...

      // Buscar si hay disponibilidad para este día de la semana
      const dayAvailabilities = profile.availabilities.filter(
        (a) => a.weekday === currentDayOfWeek
      );

      // Si hay, generar los slots horarios
      dayAvailabilities.forEach((availability) => {
        const { hours: startHour, minutes: startMinute } = parseTime(availability.start_time);
        const { hours: endHour, minutes: endMinute } = parseTime(availability.end_time);

        let slotStart = setSeconds(setMinutes(setHours(currentDate, startHour), startMinute), 0);
        const slotEndLimit = setSeconds(setMinutes(setHours(currentDate, endHour), endMinute), 0);

        // Generar slots de 1 hora (puedes ajustar la duración)
        while (slotStart < slotEndLimit) {
          const slotEnd = addHours(slotStart, 1);

          // Omitir slots que ya pasaron
          if (slotStart < today) {
             slotStart = slotEnd;
             continue;
          }

          // Verificar si este slot está reservado
          const isBooked = mockBookedAppointments.some(booked =>
            isWithinInterval(slotStart, { start: booked.start, end: booked.end }) ||
            isWithinInterval(booked.start, { start: slotStart, end: slotEnd })
          );

          events.push({
            title: isBooked ? 'Reservado' : 'Disponible',
            start: slotStart,
            end: slotEnd,
            isAvailable: !isBooked, // Propiedad personalizada para manejar el clic
            resourceId: profile.id // Guardamos el ID del psicólogo por si acaso
          });

          slotStart = slotEnd; // Avanzar al siguiente slot
        }
      });

      currentDate = addDays(currentDate, 1); // Pasar al siguiente día
    }

    return events;
  }, [profile]); // Recalcular si el perfil cambia

  // --- 4. Manejador de clics en slots ---
  const handleSlotSelect = (event) => {
    if (event.isAvailable) {
      // Aquí deberías abrir un modal de confirmación
      alert(`Has seleccionado el horario: ${format(event.start, 'Pp', { locale: es })}. \n(Aquí iría la lógica para reservar)`);
      // Lógica para reservar:
      // 1. Mostrar Modal de confirmación
      // 2. Si confirma -> Llamar a la API (ej: POST /appointments)
      // 3. Actualizar la lista de eventos (marcar como reservado o recargar)
    } else {
      alert("Este horario ya está reservado.");
    }
  };

  // --- 5. Estilo visual de los eventos ---
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: event.isAvailable ? 'var(--color-brand-secondary)' : '#ccc', // Verde para disponible, gris para reservado
      borderRadius: '5px',
      opacity: 0.8,
      color: event.isAvailable ? 'white' : '#666',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  // --- Renderizado (Loading, Not Found) ---
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.section}><p>Cargando perfil...</p></div>
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
              <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>Volver</button>
              <Link className={styles.primaryBtn} to="/">Ir al Inicio</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Renderizado del Perfil + Calendario ---
  const {
    photo_url,
    license_number,
    specialty,
    professional_description,
    user_id,
  } = profile;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* --- Cabecera (como antes) --- */}
        <div className={styles.headerCard}>
          <div className={styles.avatar}>
            {photo_url
              ? <img src={photo_url} alt="Foto del profesional" />
              : <div className={styles.avatarFallback}>CM</div>}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>Psicólogo/a #{user_id ?? "N/D"}</h1>
            <p className={styles.specialty}>{specialty || "Especialidad no especificada"}</p>
            <p className={styles.license}>Licencia: {license_number || "N/D"}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* --- Sección "Sobre mí" (como antes) --- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre mí</h2>
            <p className={styles.description}>
              {professional_description || "Este profesional aún no ha añadido su descripción."}
            </p>
          </section>

          {/* --- 6. Sección del Calendario --- */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Agenda tu cita</h2>
            {calendarEvents.length === 0 && !loading ? (
                 <p className={styles.muted}>Este profesional no tiene horarios disponibles publicados.</p>
            ) : (
                <div className={styles.calendarContainer} style={{ height: '60vh', minHeight: '500px' }}>
              <div style={{ height: '60vh', minHeight: '500px' }}> {/* Darle altura */}
                <Calendar
                  localizer={localizer}
                  culture='es'
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView={Views.WEEK} // Vista semanal por defecto
                  views={[Views.WEEK, Views.DAY]} // Vistas permitidas
                  selectable={true}
                  onSelectEvent={handleSlotSelect} // Manejador de clic
                  eventPropGetter={eventPropGetter} // Estilo de eventos
                  min={setHours(new Date(), 8)}  // Hora mínima a mostrar (8 AM)
                  max={setHours(new Date(), 20)} // Hora máxima (8 PM)
                  step={60} // Intervalo de 60 minutos
                  timeslots={1} // Mostrar 1 slot por intervalo (1 hora)
                  messages={{ // Textos en español
                    next: "Sig",
                    previous: "Ant",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay horarios disponibles en este rango.",
                    showMore: total => `+ Ver más (${total})`
                  }}
                />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* --- Acciones Footer (como antes) --- */}
        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} to="/">Volver al inicio</Link>
          {/* El botón de reservar ya no es necesario aquí, la interacción es en el calendario */}
        </div>
      </div>
    </div>
  );
}