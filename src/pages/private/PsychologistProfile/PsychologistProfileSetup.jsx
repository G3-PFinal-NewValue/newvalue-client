import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import styles from "./PsychologistProfileSetup.module.css";
import { createPsychologistProfile } from "../../../services/psychologistsService";

// ----- Schema (según tablas backend) -----
const availabilitySchema = z.object({
  weekday: z.number().min(0).max(6), // 0 = domingo ... 6 = sábado
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
}).refine(a => a.start_time < a.end_time, {
  message: "La hora de inicio debe ser menor a la de fin",
  path: ["end_time"],
});

const schema = z.object({
  license_number: z.string().min(4, "Obligatorio"),
  specialty: z.string().min(2, "Obligatorio"),
  professional_description: z.string().min(20, "Describe tu enfoque (mín. 20 caracteres)"),
  availabilities: z.array(availabilitySchema).min(1, "Agrega al menos un horario"),
});

const WEEKDAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const SPECIALTIES = [
  "Terapia Cognitivo-Conductual",
  "Ansiedad y Estrés",
  "Depresión",
  "Terapia de Pareja",
  "Mindfulness",
  "Duelo",
  "Trastornos del Sueño",
  "Otro",
];

export default function PsychologistProfileSetup() {
  const { user } = useAuth(); // asumimos user.id disponible
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      license_number: "",
      specialty: "",
      professional_description: "",
      availabilities: [{ weekday: 1, start_time: "09:00", end_time: "12:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availabilities",
  });

  const onSubmit = async (values) => {
    try {
      // mock: enviamos user_id + payload
      await createPsychologistProfile({
        user_id: user?.id ?? 1,
        license_number: values.license_number,
        specialty: values.specialty,
        validated: false, // lo hará admin/back
        professional_description: values.professional_description,
        availabilities: values.availabilities,
      });
      alert("Perfil creado (mock). Cuando esté el backend, conectamos.");
      navigate("/app"); // o donde quieras aterrizar
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el perfil.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Crear perfil profesional</h1>
          <p className={styles.subtitle}>
            Comparte tu número de licencia, especialidad, descripción y horarios disponibles.
          </p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Número de licencia"
              placeholder="Ej: COP-123456"
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            {/* Especialidad (select + campo 'Otro') */}
            <div className={styles.group}>
              <label className={styles.label}>Especialidad</label>
              <select
                className={styles.select}
                {...register("specialty")}
                onChange={(e) => setValue("specialty", e.target.value)}
              >
                <option value="">Selecciona una especialidad</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.specialty && <p className={styles.error}>{errors.specialty.message}</p>}
            </div>

            <div className={styles.group}>
              <label className={styles.label}>Descripción profesional</label>
              <textarea
                rows={5}
                placeholder="Tu enfoque terapéutico, experiencia y líneas de trabajo…"
                className={styles.textarea}
                {...register("professional_description")}
              />
              {errors.professional_description && (
                <p className={styles.error}>{errors.professional_description.message}</p>
              )}
            </div>

            {/* Disponibilidades */}
            <div className={styles.availBox}>
              <div className={styles.availHeader}>
                <h2 className={styles.sectionTitle}>Disponibilidades</h2>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => append({ weekday: 1, start_time: "09:00", end_time: "12:00" })}
                >
                  + Añadir horario
                </button>
              </div>

              {fields.map((f, idx) => (
                <div key={f.id} className={styles.availRow}>
                  <select
                    className={styles.select}
                    {...register(`availabilities.${idx}.weekday`)}
                    defaultValue={f.weekday}
                    onChange={(e) =>
                      setValue(`availabilities.${idx}.weekday`, Number(e.target.value))
                    }
                  >
                    {WEEKDAYS.map((d, i) => (
                      <option key={d} value={i}>{d}</option>
                    ))}
                  </select>

                  <input
                    type="time"
                    className={styles.time}
                    {...register(`availabilities.${idx}.start_time`)}
                    defaultValue={f.start_time}
                  />

                  <input
                    type="time"
                    className={styles.time}
                    {...register(`availabilities.${idx}.end_time`)}
                    defaultValue={f.end_time}
                  />

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(idx)}
                    aria-label="Quitar"
                  >
                    ✕
                  </button>

                  {/* errores por fila */}
                  <div className={styles.rowErrors}>
                    {errors.availabilities?.[idx]?.start_time && (
                      <span className={styles.error}>
                        {errors.availabilities[idx].start_time.message}
                      </span>
                    )}
                    {errors.availabilities?.[idx]?.end_time && (
                      <span className={styles.error}>
                        {errors.availabilities[idx].end_time.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {typeof errors.availabilities?.message === "string" && (
                <p className={styles.error}>{errors.availabilities.message}</p>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
