import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import AvailabilityCalendar from "../../../components/common/AvailabilityCalendar/AvailabilityCalendar.jsx";
import styles from "./PsychologistProfileSetup.module.css";
import {
  createPsychologistProfile,
  getPsychologistProfileById,
  updatePsychologistProfile,
} from "../../../services/psychologistsService";
import { getAllSpecialities } from "../../../services/specialityService.js";
// --- Schemas y Constantes ---
const availabilitySchema = z
  .object({
    id: z.string().optional(),
    specific_date: z.string().min(1, "Fecha es requerida"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
    is_available: z.boolean().default(true),
    is_holiday: z.boolean().default(false),
    is_vacation: z.boolean().default(false),
    notes: z.string().optional(),
    // Mantener compatibilidad con el sistema anterior
    weekday: z.number().optional(),
  })
  .refine((a) => a.start_time < a.end_time, {
    message: "La hora de inicio debe ser menor a la de fin",
    path: ["end_time"],
  });

const schema = z.object({
  license_number: z.string().min(4, "Número de licencia es obligatorio"),
  specialities: z
    .array(z.string())
    .min(1, "Selecciona al menos una especialidad"),
  professional_description: z
    .string()
    .min(20, "Describe tu enfoque (mín. 20 caracteres)"),
  availabilities: z.array(availabilitySchema).optional().default([]),
});

// WEEKDAYS ya no se usa con el nuevo sistema de calendario

const defaultFormValues = {
  license_number: "",
  specialities: [],
  professional_description: "",
  availabilities: [],
};

export default function PsychologistProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para la foto
  const [existingProfile, setExistingProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); //
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [allSpecialties, setAllSpecialties] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues, // <-- 2. Usar la variable
  });

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const specialtiesData = await getAllSpecialities();
        setAllSpecialties(specialtiesData);

        const profileData = await getPsychologistProfileById(user.id);

        if (profileData) {
          // MODO EDICIÓN
          setExistingProfile(profileData);
          const formattedData = {
            license_number: profileData.license_number || "",
            professional_description:
              profileData.professional_description || "",
            specialities: profileData.specialities
              ? profileData.specialities.map((s) => String(s.id))
              : [],
            availabilities:
              profileData.availabilities &&
              profileData.availabilities.length > 0
                ? profileData.availabilities.map((a) => ({
                    id: a.id,
                    specific_date:
                      a.specific_date || new Date().toISOString().split("T")[0], // Fecha por defecto si no existe
                    start_time: a.start_time.substring(0, 5),
                    end_time: a.end_time.substring(0, 5),
                    is_available: a.is_available ?? true,
                    is_holiday: a.is_holiday ?? false,
                    is_vacation: a.is_vacation ?? false,
                    notes: a.notes || "",
                    weekday: a.weekday, // Mantener compatibilidad
                  }))
                : defaultFormValues.availabilities,
          };
          reset(formattedData);
          if (profileData.photo) {
            setPhotoPreview(profileData.photo);
          }
        } else {
          setExistingProfile(null);
          reset(defaultFormValues);
        }
      } catch (error) {
        if (error.status === 404) {
          console.log(
            "No se encontró perfil existente, cargando formulario de creación."
          );
          setExistingProfile(null);
          reset(defaultFormValues);
        } else {
          console.error("Error cargando datos del perfil:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, reset]);

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
    if (!user || !user.id) {
      alert("Error: Usuario no autenticado.");
      return;
    }

    const formData = new FormData();
    formData.append("license_number", values.license_number);
    formData.append(
      "professional_description",
      values.professional_description
    );
    formData.append("specialities", JSON.stringify(values.specialities));
    formData.append("availabilities", JSON.stringify(values.availabilities));

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      let newProfile;

      if (existingProfile) {
        // MODO EDICIÓN
        console.log("Intentando llamar a updatePsychologistProfile...");
        newProfile = await updatePsychologistProfile(user.id, formData);
        alert("Perfil actualizado con éxito.");
      } else {
        // MODO CREACIÓN
        newProfile = await createPsychologistProfile(formData);
        alert("Perfil creado con éxito.");
      }

      navigate(`/profile/${newProfile.user_id}`); // Ir al perfil público
    } catch (e) {
      console.error("Error DENTRO del try/catch de onSubmit:", e);
      alert(
        e?.response?.data?.message ||
          e.message ||
          "No se pudo guardar el perfil. Revisa la consola."
      );
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.card}>
            <p style={{ textAlign: "center" }}>Cargando datos del perfil...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {/* Texto dinámico */}
            {existingProfile
              ? "Editar perfil profesional"
              : "Crear perfil profesional"}
          </h1>
          <p className={styles.subtitle}>
            {/* Texto dinámico */}
            {existingProfile
              ? "Actualiza tu foto, información profesional y horarios."
              : "Sube tu foto, añade tu información profesional y tus horarios disponibles."}
          </p>

          {/* Sección Foto (sin cambios) */}
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className={styles.photoPreview}
                />
              ) : (
                <span>Seleccionar foto</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                hidden
              />
            </label>
            <p className={styles.photoHint}>PNG/JPG/WebP · Máx ~2MB</p>
          </div>

          {/* Formulario */}
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Número de licencia"
              placeholder="Ej: COP-123456"
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            <div className={styles.specialtyBox}>
              <h2 className={styles.sectionTitle}>Especialidades</h2>
              {allSpecialties.length === 0 ? (
                <p>Cargando especialidades...</p>
              ) : (
                <div className={styles.specialtyGrid}>
                  {allSpecialties.map((spec) => (
                    <label key={spec.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        value={spec.id}
                        {...register("specialities")}
                      />
                      <span>{spec.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {errors.specialities && (
                <p className={styles.error}>{errors.specialities.message}</p>
              )}
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
                <p className={styles.error}>
                  {errors.professional_description.message}
                </p>
              )}
            </div>

            <div className={styles.availBox}>
              <h2 className={styles.sectionTitle}>Gestión de Disponibilidad</h2>
              <p className={styles.sectionDescription}>
                Configura tu disponibilidad haciendo clic en las fechas del
                calendario. Puedes establecer horarios específicos, marcar días
                como no disponibles, festivos o vacaciones según tus
                necesidades.
              </p>

              <AvailabilityCalendar
                value={watch("availabilities")}
                onChange={(newAvailabilities) => {
                  setValue("availabilities", newAvailabilities);
                }}
                className={styles.calendar}
              />
              {errors.availabilities && (
                <p className={styles.error}>{errors.availabilities.message}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting
                ? existingProfile
                  ? "Actualizando..."
                  : "Guardando..."
                : existingProfile
                ? "Actualizar perfil"
                : "Guardar perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
