import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPsychologistProfileById } from "../../../services/psychologistsService"; 
import styles from "./PsychologistPublicProfile.module.css";

// Importaciones de react-big-calendar y date-fns
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
import es from 'date-fns/locale/es'; 
import "react-big-calendar/lib/css/react-big-calendar.css";

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


const parseTime = (timeStr) => {
  if (!timeStr || !timeStr.includes(':')) return { hours: 0, minutes: 0 }; // Manejo defensivo
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};


export default function PsychologistPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
       
        const p = await getPsychologistProfileById(id); 
        setProfile(p || null);
      } catch (error) {
        console.error("Error cargando el perfil (mock):", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

 
  const calendarEvents = useMemo(() => {
    if (!profile?.availabilities) return [];

    const events = [];
    const today = new Date();
    const startOfToday = setSeconds(setMinutes(setHours(today, 0), 0), 0); 
    const futureLimit = addDays(startOfToday, 28); 


    const mockBookedAppointments = [

    ];
    // Fin de la simulación

    let currentDate = startOfToday;
    while (currentDate < futureLimit) {
      const currentDayOfWeek = getDay(currentDate); // 0=Domingo, 1=Lunes,...

      const dayAvailabilities = profile.availabilities.filter(
        (a) => a.weekday === currentDayOfWeek
      );

      dayAvailabilities.forEach((availability) => {
        const { hours: startHour, minutes: startMinute } = parseTime(availability.start_time);
        const { hours: endHour, minutes: endMinute } = parseTime(availability.end_time);

        if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return;

        let slotStart = setSeconds(setMinutes(setHours(currentDate, startHour), startMinute), 0);
        const slotEndLimit = setSeconds(setMinutes(setHours(currentDate, endHour), endMinute), 0);

        while (slotStart < slotEndLimit) {
          const slotEnd = addHours(slotStart, 1); // Slots de 1 hora

      
          if (slotEnd <= today) { 
             slotStart = slotEnd;
             continue;
          }

          const isBooked = mockBookedAppointments.some(booked =>
             // Comprobar si hay solapamiento exacto o parcial
             (slotStart < booked.end && slotEnd > booked.start)
          );

          events.push({
            title: isBooked ? 'Reservado' : 'Disponible',
            start: slotStart,
            end: slotEnd,
            isAvailable: !isBooked,
            resourceId: profile.id 
          });

          slotStart = slotEnd; 
        }
      });
      currentDate = addDays(currentDate, 1); 
    }
    return events;
  }, [profile]);

  // --- Manejador de clics en slots ---
  const handleSlotSelect = (event) => {
    if (event.isAvailable) {
      alert(`Has seleccionado el horario: ${format(event.start, 'Pp', { locale: es })}. \n(Aquí iría la lógica para reservar)`);
      // Lógica futura: Abrir modal, confirmar, llamar API POST /appointments
    } else {
      alert("Este horario ya está reservado.");
    }
  };

  // --- Estilo visual de los eventos ---
  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: event.isAvailable ? 'var(--color-brand-secondary)' : '#e0e0e0', // Gris más claro para reservado
      borderRadius: '5px',
      opacity: event.isAvailable ? 0.9 : 0.7, // Ligeramente más opaco si está disponible
      color: event.isAvailable ? 'white' : '#757575', // Texto gris oscuro para reservado
      border: 'none', // Sin borde
      cursor: event.isAvailable ? 'pointer' : 'not-allowed', // Cambiar cursor
      fontSize: '13px', // Tamaño de fuente del evento
      padding: '2px 5px', // Padding interno
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
    // first_name, // Datos esperados del backend
    // last_name 
  } = profile;

  // Placeholder para nombre mientras no venga del backend
  const psychologistName = profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : `Psicólogo/a #${user_id ?? "N/D"}`;
  
  // Placeholder para iniciales
  const fallbackInitial = profile.first_name ? profile.first_name[0].toUpperCase() : 'P';


  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* --- Cabecera --- */}
        <div className={styles.headerCard}>
          <div className={styles.avatar}>
            {photo_url
              ? <img src={photo_url} alt={`Foto de ${psychologistName}`} /> // Alt text dinámico
              : <div className={styles.avatarFallback}>{fallbackInitial}</div>}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>
              {/* RECORDATORIO: Pedir first_name y last_name al backend */}
              {psychologistName}
            </h1>
            <p className={styles.specialty}>{specialty || "Especialidad no especificada"}</p>
            <p className={styles.license}>Licencia: {license_number || "N/D"}</p>
          </div>
        </div>

        {/* --- Grid: Sobre mí y Calendario --- */}
        <div className={styles.grid}>
          {/* Sección "Sobre mí" */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre mí</h2>
            <p className={styles.description}>
              {professional_description || "Este profesional aún no ha añadido su descripción."}
            </p>
          </section>

          {/* Sección del Calendario */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Agenda tu cita</h2>
            {calendarEvents.length === 0 && !loading ? (
                 <p className={styles.muted}>Este profesional no tiene horarios disponibles publicados en las próximas 4 semanas.</p>
            ) : (
              <div className={styles.calendarContainer} style={{ height: '65vh', minHeight: '550px' }}> {/* Ajustar altura si es necesario */}
                <Calendar
                  localizer={localizer}
                  culture='es'
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView={Views.WEEK} 
                  views={[Views.WEEK, Views.DAY]} 
                  selectable={false} // Deshabilitar selección de rango de tiempo
                  onSelectEvent={handleSlotSelect} // Solo permitir clic en eventos
                  eventPropGetter={eventPropGetter} 
                  min={setHours(new Date(), 8)}  
                  max={setHours(new Date(), 21)} // Extender hasta las 9 PM?
                  step={60} 
                  timeslots={1} 
                  messages={{ 
                    next: "Sig >", // Flechas más claras
                    previous: "< Ant",
                    today: "Hoy",
                    week: "Semana",
                    day: "Día",
                    // Ocultar textos no usados
                    // month: "Mes", 
                    // agenda: "Agenda",
                    // date: "Fecha",
                    // time: "Hora",
                    // event: "Evento", 
                    noEventsInRange: "No hay horarios disponibles en esta vista.",
                    showMore: total => `+ ${total} más` // Texto más corto
                  }}
                  formats={{ // Formato de hora en la columna izquierda
                     timeGutterFormat: (date, culture, localizer) =>
                       localizer.format(date, 'H:mm', culture), // Formato 24h
                  }}
                  dayLayoutAlgorithm="no-overlap" // Evitar solapamiento visual
                />
              </div>
            )}
          </section>
        </div>

        {/* --- Acciones Footer --- */}
        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}