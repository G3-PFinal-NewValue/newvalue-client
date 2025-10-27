import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import styles from "./PsychologistProfileSetup.module.css";
import { createPsychologistProfile } from "../../../services/psychologistsService"; // Asegúrate que la ruta sea correcta

// --- Schemas y Constantes ---
const availabilitySchema = z.object({
  // Asegúrate de que weekday sea number en el frontend si Zod lo espera
  weekday: z.preprocess((val) => Number(val), z.number().min(0).max(6)),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
}).refine(a => a.start_time < a.end_time, {
  message: "La hora de inicio debe ser menor a la de fin",
  path: ["end_time"],
});

const schema = z.object({
  license_number: z.string().min(4, "Número de licencia es obligatorio"),
  // specialty: z.string().min(2, "Obligatorio"), // Comentado - Se manejará por tabla de unión
  professional_description: z.string().min(20, "Describe tu enfoque (mín. 20 caracteres)"),
  availabilities: z.array(availabilitySchema).min(1, "Agrega al menos un horario"),
});

const WEEKDAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
// SPECIALTIES ya no se usa aquí si no hay campo directo
// const SPECIALTIES = [ ... ];

export default function PsychologistProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para la foto
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    // 👇 Desestructura formState para ver errores y isSubmitting
    formState: { errors, isSubmitting },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      license_number: "",
      // specialty: "", // Comentado
      professional_description: "",
      availabilities: [{ weekday: 1, start_time: "09:00", end_time: "12:00" }], // weekday como número
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "availabilities" });

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    setPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  };

  const onSubmit = async (values) => {
    // 👇 LOG 1: Confirmar que onSubmit se llama 👇
    console.log("¡onSubmit SE HA LLAMADO!");
    console.log("onSubmit llamado con values:", values);
    console.log("Archivo de foto actual:", photoFile);

    if (!user || !user.id) {
        alert("Error: Usuario no autenticado.");
        return;
    }

    const formData = new FormData();
    formData.append('license_number', values.license_number);
    formData.append('professional_description', values.professional_description);
    // No envíes user_id, el backend lo toma del token
    // No envíes availabilities aquí si el endpoint POST /psychologist no las procesa

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    // 👇 LOG 2: Ver las entradas del FormData antes de enviar 👇
    console.log("FormData creado. Entradas:");
    for (let [key, value] of formData.entries()) {
        // Si el valor es un archivo, loguea su nombre y tipo
        if (value instanceof File) {
            console.log(`FormData entry: ${key}`, { name: value.name, type: value.type, size: value.size });
        } else {
            console.log(`FormData entry: ${key}`, value);
        }
    }

    try {
      console.log("Intentando llamar a createPsychologistProfile..."); // LOG 3
      const newProfile = await createPsychologistProfile(formData);

      alert("Perfil de psicólogo creado con éxito.");
      navigate(`/profile/${newProfile.user_id}`);

    } catch (e) {
      // 👇 LOG 4: Capturar error específico de la llamada API 👇
      console.error("Error DENTRO del try/catch de onSubmit:", e);
      alert(e?.response?.data?.message || e.message || "No se pudo guardar el perfil. Revisa la consola.");
    }
  };

  // 👇 LOG 5: Ver el estado del formulario en cada renderizado 👇
  console.log("Estado del formulario (formState):", { errors, isSubmitting });

  return (
    <div className={styles.page}>
       {/* Botón de prueba fuera del formulario */}
       <button onClick={() => console.log('Botón de prueba FUERA clickeado!')} style={{position: 'absolute', top: '80px', left: '10px', zIndex: 100}}>
           Prueba Clic Fuera
       </button>

      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Crear perfil profesional</h1>
          <p className={styles.subtitle}>
            Sube tu foto, añade tu información profesional y tus horarios disponibles.
          </p>

          {/* Sección Foto */}
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
              ) : (
                <span>Seleccionar foto</span>
              )}
              <input type="file" accept="image/*" onChange={onPhotoChange} hidden />
            </label>
            <p className={styles.photoHint}>PNG/JPG/WebP · Máx ~2MB (recomendado)</p>
          </div>

          {/* Formulario */}
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Número de licencia"
              placeholder="Ej: COP-123456"
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            {/* Campo Specialty ya no está aquí */}

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
                  // Asegúrate que weekday sea número al añadir
                  onClick={() => append({ weekday: 1, start_time: "09:00", end_time: "12:00" })}
                >
                  + Añadir horario
                </button>
              </div>

              {fields.map((f, idx) => (
                <div key={f.id} className={styles.availRow}>
                  <select
                    className={styles.select}
                    // defaultValue={f.weekday} // react-hook-form maneja el valor
                    {...register(`availabilities.${idx}.weekday`, { valueAsNumber: true })} // Asegura que se registre como número
                  >
                    {WEEKDAYS.map((d, i) => (
                      <option key={i} value={i}>{d}</option> // Asegúrate que value sea el índice numérico
                    ))}
                  </select>

                  <input
                    type="time"
                    className={styles.time}
                    {...register(`availabilities.${idx}.start_time`)}
                    // defaultValue={f.start_time} // react-hook-form maneja el valor
                  />

                  <input
                    type="time"
                    className={styles.time}
                    {...register(`availabilities.${idx}.end_time`)}
                    // defaultValue={f.end_time} // react-hook-form maneja el valor
                  />

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(idx)}
                    aria-label="Quitar"
                  >
                    ✕
                  </button>

                  {/* Mostrar errores de fila */}
                  <div className={styles.rowErrors}>
                     {errors.availabilities?.[idx]?.weekday && (
                       <span className={styles.error}>Día: {errors.availabilities[idx].weekday.message}</span>
                     )}
                     {errors.availabilities?.[idx]?.start_time && (
                       <span className={styles.error}>Inicio: {errors.availabilities[idx].start_time.message}</span>
                     )}
                     {errors.availabilities?.[idx]?.end_time && (
                       <span className={styles.error}>Fin: {errors.availabilities[idx].end_time.message}</span>
                     )}
                  </div>

                </div>
              ))}

              {/* Mostrar error general de availabilities (ej: 'mínimo 1') */}
              {errors.availabilities && typeof errors.availabilities === 'object' && 'message' in errors.availabilities && (
                  <p className={styles.error}>{errors.availabilities.message}</p>
              )}
               {/* Mostrar error si la raíz del array tiene un error (menos común) */}
              {errors.availabilities?.root && (
                 <p className={styles.error}>{errors.availabilities.root.message}</p>
              )}


            </div>

            <button
              type="submit" // Correcto
              className={styles.submitButton}
              disabled={isSubmitting}
              // 👇 LOG 6: Confirmar que el clic se registra 👇
              onClick={() => {
                console.log("¡CLIC en Guardar perfil detectado!");
              }}
            >
              {isSubmitting ? "Guardando…" : "Guardar perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}