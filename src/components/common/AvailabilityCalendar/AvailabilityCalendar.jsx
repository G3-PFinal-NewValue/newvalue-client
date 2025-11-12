<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import esLocale from "date-fns/locale/es";
import styles from "./AvailabilityCalendar.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
=======
import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './AvailabilityCalendar.module.css';
import Swal from 'sweetalert2';
>>>>>>> develop

const locales = { es: esLocale };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const todayIso = new Date().toISOString().split("T")[0];

const toISODate = (date) => format(date, "yyyy-MM-dd");

const parseDateSafe = (iso) => {
  if (!iso) return new Date();
  const parsed = parseISO(iso);
  return parsed instanceof Date && !Number.isNaN(parsed.getTime())
    ? parsed
    : new Date();
};

const buildDateTime = (dateIso, time = "00:00") => {
  const baseDate = parseDateSafe(dateIso ?? todayIso);
  const [hours = 0, minutes = 0] = time
    .split(":")
    .map((value) => Number(value) || 0);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const createEmptySlot = (specificDate) => ({
  specific_date: specificDate ?? todayIso,
  start_time: "09:00",
  end_time: "10:00",
  is_available: true,
  notes: "",
});

const messages = {
  next: "Sig.",
  previous: "Ant.",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  showMore: (total) => `+${total} más`,
};

export default function AvailabilityCalendar({
  value = [],
  onChange,
  className = "",
}) {
  const slots = Array.isArray(value) ? value : [];
  const [selectedDate, setSelectedDate] = useState(
    slots[0]?.specific_date ?? todayIso
  );
  const [currentViewDate, setCurrentViewDate] = useState(() =>
    parseDateSafe(selectedDate)
  );

  useEffect(() => {
    if (slots.length === 0) {
      setSelectedDate(todayIso);
      return;
    }

    const stillExists = slots.some(
      (slot) => slot?.specific_date === selectedDate
    );

    if (!stillExists) {
      setSelectedDate(slots[0]?.specific_date ?? todayIso);
    }
  }, [slots, selectedDate]);

  useEffect(() => {
    setCurrentViewDate(parseDateSafe(selectedDate));
  }, [selectedDate]);

  const events = useMemo(() => {
    return slots.map((slot, index) => {
      const start = buildDateTime(slot.specific_date, slot.start_time);
      let end = buildDateTime(slot.specific_date, slot.end_time);
      if (end <= start) {
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
      return {
        title: `${slot.start_time ?? "--:--"} · ${
          slot.is_available === false ? "Bloqueado" : "Disponible"
        }`,
        start,
        end,
        resource: { index, specific_date: slot.specific_date },
      };
    });
  }, [slots]);

  const slotsForSelectedDate = useMemo(() => {
    return slots
      .map((slot, index) => ({ ...slot, _index: index }))
      .filter((slot) => slot?.specific_date === selectedDate);
  }, [slots, selectedDate]);

  const updateSlots = (nextSlots) => {
    if (typeof onChange === "function") {
      onChange(nextSlots);
    }
<<<<<<< HEAD
=======
    
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
>>>>>>> develop
  };

  const handleFieldChange = (targetIndex, field, newValue) => {
    updateSlots(
      slots.map((slot, index) =>
        index === targetIndex ? { ...slot, [field]: newValue } : slot
      )
    );
  };

  const handleAddSlot = () => {
    updateSlots([...slots, createEmptySlot(selectedDate)]);
  };

  const handleDeleteSlot = (targetIndex) => {
    updateSlots(slots.filter((_, index) => index !== targetIndex));
  };

  const handleSelectDate = (iso) => {
    if (!iso) return;
    setSelectedDate(iso);
    setCurrentViewDate(parseDateSafe(iso));
  };

  const renderedClassName = `${styles.calendar} ${className}`.trim();
  const selectedDateLabel = format(
    parseDateSafe(selectedDate),
    "EEEE d 'de' MMMM",
    { locale: esLocale }
  );

  return (
    <div className={renderedClassName}>
      <div className={styles.calendarPanel}>
        <Calendar
          localizer={localizer}
          culture="es"
          date={currentViewDate}
          onNavigate={(date) => setCurrentViewDate(date)}
          views={[Views.MONTH]}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          popup
          messages={messages}
          onSelectSlot={({ start }) => handleSelectDate(toISODate(start))}
          onSelectEvent={(event) =>
            handleSelectDate(
              event?.resource?.specific_date ?? toISODate(event.start)
            )
          }
          style={{ height: 480 }}
        />
      </div>

      <div className={styles.detailPanel}>
        <div className={styles.detailHeader}>
          <div>
            <p className={styles.detailTitle}>{selectedDateLabel}</p>
            <p className={styles.detailSubtitle}>
              {slotsForSelectedDate.length === 0
                ? "No hay horarios configurados para esta fecha."
                : `${slotsForSelectedDate.length} horario(s) configurados.`}
            </p>
          </div>
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddSlot}
          >
            + Añadir horario
          </button>
        </div>

        {slotsForSelectedDate.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              Pulsa “Añadir horario” o selecciona un evento existente en el
              calendario para editarlo.
            </p>
          </div>
        ) : (
          <div className={styles.slotList}>
            {slotsForSelectedDate.map((slot) => (
              <div key={slot.id ?? slot._index} className={styles.slotCard}>
                <div className={styles.slotFields}>
                  <label className={styles.field}>
                    <span>Fecha</span>
                    <input
                      type="date"
                      value={slot.specific_date || selectedDate}
                      onChange={(event) =>
                        handleFieldChange(
                          slot._index,
                          "specific_date",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Inicio</span>
                    <input
                      type="time"
                      value={slot.start_time || ""}
                      onChange={(event) =>
                        handleFieldChange(
                          slot._index,
                          "start_time",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Fin</span>
                    <input
                      type="time"
                      value={slot.end_time || ""}
                      onChange={(event) =>
                        handleFieldChange(
                          slot._index,
                          "end_time",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={slot.is_available ?? true}
                      onChange={() =>
                        handleFieldChange(
                          slot._index,
                          "is_available",
                          !(slot.is_available ?? true)
                        )
                      }
                    />
                    <span>Disponible</span>
                  </label>

                  <label className={styles.field} data-span="notes">
                    <span>Notas</span>
                    <input
                      type="text"
                      placeholder="Detalle opcional"
                      value={slot.notes || ""}
                      onChange={(event) =>
                        handleFieldChange(
                          slot._index,
                          "notes",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDeleteSlot(slot._index)}
                >
                  Eliminar horario
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
AvailabilityCalendar.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      specific_date: PropTypes.string,
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      is_available: PropTypes.bool,
      notes: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onChange: PropTypes.func,
  className: PropTypes.string,
};
=======
// Componente Modal para crear/editar eventos
function EventModal({ event, onSave, onDelete, onCancel }) {
  const [formData, setFormData] = useState({
    specific_date: event?.specific_date || '',
    start_time: event?.start_time || '09:00',
    end_time: event?.end_time || '17:00',
    is_available: event?.is_available ?? true,
    notes: event?.notes || ''
  });

  const handleSubmit = () => { // CA: controlar envío manualmente para evitar usar un <form>
    
    // Validaciones básicas
    if (!formData.specific_date || !formData.start_time || !formData.end_time) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    if (formData.start_time >= formData.end_time) {
      Swal.fire({
        icon: 'error',
        title: 'Horario inválido',
        text: 'La hora de inicio debe ser anterior a la hora de fin',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    onSave({
      ...event,
      ...formData
    });
  };

  const handleDelete = () => {
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La disponibilidad ha sido eliminada',
          timer: 2000,
          showConfirmButton: false
        });
      }
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
        
        <div className={styles.modalForm}> {/* CA: reemplazar <form> para evitar formularios anidados */}
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
            <button type="button" onClick={handleSubmit} className={styles.saveBtn}> {/* CA: disparar guardado sin formulario */}
              {event?.id ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> develop
