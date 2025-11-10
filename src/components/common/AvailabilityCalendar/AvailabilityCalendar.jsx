import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import esLocale from "date-fns/locale/es";
import styles from "./AvailabilityCalendar.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
