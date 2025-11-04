import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './AvailabilityCalendar.module.css';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Tipos de eventos simplificados
const EVENT_TYPES = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
};

const EVENT_COLORS = {
  [EVENT_TYPES.AVAILABLE]: '#10b981', // Verde
  [EVENT_TYPES.UNAVAILABLE]: '#ef4444' // Rojo
};

export default function AvailabilityCalendar({ 
  value = [], 
  onChange, 
  readOnly = false,
  className = ''
}) {
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  // Handler para cambio de vista
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // Convertir los datos de disponibilidad a eventos del calendario
  const events = useMemo(() => {
    return value.map((availability, index) => {
      const startDate = new Date(availability.specific_date);
      const [startHour, startMinute] = availability.start_time.split(':');
      const [endHour, endMinute] = availability.end_time.split(':');
      
      const startDateTime = new Date(startDate);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
      
      const endDateTime = new Date(startDate);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      return {
        id: availability.id || `temp-${index}`,
        title: availability.is_available 
          ? `Disponible ${availability.start_time}-${availability.end_time}`
          : `No disponible ${availability.start_time}-${availability.end_time}`,
        start: startDateTime,
        end: endDateTime,
        resource: availability,
        type: availability.is_available ? EVENT_TYPES.AVAILABLE : EVENT_TYPES.UNAVAILABLE
      };
    });
  }, [value]);

  // Personalizar el estilo de los eventos
  const eventStyleGetter = useCallback((event) => {
    const backgroundColor = EVENT_COLORS[event.type] || '#6b7280';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  }, []);

  // Manejar selección de slot (fecha/hora)
  const handleSelectSlot = useCallback(({ start, end }) => {
    if (readOnly) return;
    
    setCurrentEvent({
      specific_date: moment(start).format('YYYY-MM-DD'),
      start_time: moment(start).format('HH:mm'),
      end_time: moment(end).format('HH:mm'),
      is_available: true,
      notes: ''
    });
    setShowEventModal(true);
  }, [readOnly]);

  // Manejar selección de evento existente
  const handleSelectEvent = useCallback((event) => {
    if (readOnly) return;
    
    setCurrentEvent({ ...event.resource });
    setShowEventModal(true);
  }, [readOnly]);

  // Guardar evento
  const handleSaveEvent = useCallback((eventData) => {
    const newAvailabilities = [...value];
    
    if (eventData.id) {
      // Editar evento existente
      const index = newAvailabilities.findIndex(a => a.id === eventData.id);
      if (index !== -1) {
        newAvailabilities[index] = eventData;
      }
    } else {
      // Crear nuevo evento
      newAvailabilities.push({
        ...eventData,
        id: `temp-${Date.now()}` // ID temporal hasta que el backend asigne uno real
      });
    }
    
    onChange?.(newAvailabilities);
    setShowEventModal(false);
    setCurrentEvent(null);
  }, [value, onChange]);

  // Eliminar evento
  const handleDeleteEvent = useCallback(() => {
    if (!currentEvent?.id) return;
    
    const newAvailabilities = value.filter(a => a.id !== currentEvent.id);
    onChange?.(newAvailabilities);
    setShowEventModal(false);
    setCurrentEvent(null);
  }, [value, onChange, currentEvent]);

  // Funciones eliminadas - El profesional gestiona todo manualmente

  // Mensajes en español
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana', 
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: total => `+ Ver más (${total})`
  };

  return (
    <div className={`${styles.calendarContainer} ${className}`}>
      <div className={styles.legend}>
        <h4>Leyenda:</h4>
        <div className={styles.legendItems}>
          <span className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: EVENT_COLORS[EVENT_TYPES.AVAILABLE] }}></div>
            Disponible
          </span>
          <span className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: EVENT_COLORS[EVENT_TYPES.UNAVAILABLE] }}></div>
            No disponible
          </span>
        </div>
      </div>

      <div className={styles.calendarInfo}>
        <p className={styles.infoText}>
          💡 <strong>Navegación:</strong> Usa "Anterior/Siguiente" para navegar entre períodos y "Mes/Semana/Día" para cambiar la vista. 
          Haz clic en una fecha para crear disponibilidad.
        </p>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onNavigate={setCurrentDate} // Controlar navegación
        onView={handleViewChange} // Controlar vista con debug
        date={currentDate} // Fecha controlada
        view={currentView} // Vista controlada
        selectable={!readOnly}
        eventPropGetter={eventStyleGetter}
        messages={messages}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        step={30}
        timeslots={2}
        min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
        max={new Date(0, 0, 0, 22, 0, 0)} // 10:00 PM
        toolbar={true} // Asegurar que la barra de navegación esté visible
        popup={true} // Habilitar popup para eventos múltiples
        showMultiDayTimes={false}
        formats={{
          dayFormat: 'DD',
          weekdayFormat: 'dddd',
          monthHeaderFormat: 'MMMM YYYY',
          dayHeaderFormat: 'dddd DD/MM',
          dayRangeHeaderFormat: ({start, end}) => 
            `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`
        }}
      />

      {/* Modal para crear/editar eventos */}
      {showEventModal && (
        <EventModal
          event={currentEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onCancel={() => {
            setShowEventModal(false);
            setCurrentEvent(null);
          }}
        />
      )}
    </div>
  );
}

// Componente Modal para crear/editar eventos
function EventModal({ event, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState({
    specific_date: event?.specific_date || '',
    start_time: event?.start_time || '09:00',
    end_time: event?.end_time || '17:00',
    is_available: event?.is_available ?? true,
    notes: event?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.specific_date || !formData.start_time || !formData.end_time) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (formData.start_time >= formData.end_time) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }
    
    onSave({
      ...event,
      ...formData
    });
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      is_available: type === 'available'
    }));
  };

  const getCurrentType = () => {
    return formData.is_available ? 'available' : 'unavailable';
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{event?.id ? 'Editar disponibilidad' : 'Nueva disponibilidad'}</h3>
          <button type="button" onClick={onCancel} className={styles.closeBtn}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Fecha:</label>
            <input
              type="date"
              value={formData.specific_date}
              onChange={(e) => setFormData(prev => ({ ...prev, specific_date: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Hora inicio:</label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Hora fin:</label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Tipo:</label>
            <div className={styles.typeButtons}>
              <button
                type="button"
                className={`${styles.typeBtn} ${getCurrentType() === 'available' ? styles.active : ''}`}
                onClick={() => handleTypeChange('available')}
              >
                Disponible
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${getCurrentType() === 'unavailable' ? styles.active : ''}`}
                onClick={() => handleTypeChange('unavailable')}
              >
                No disponible
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Notas (opcional):</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Agregar notas adicionales..."
              rows="2"
            />
          </div>

          <div className={styles.modalActions}>
            {event?.id && (
              <button type="button" onClick={onDelete} className={styles.deleteBtn}>
                Eliminar
              </button>
            )}
            <button type="button" onClick={onCancel} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn}>
              {event?.id ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
