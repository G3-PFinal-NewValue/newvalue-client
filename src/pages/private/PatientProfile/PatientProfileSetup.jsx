import { useState } from "react"; // Importar useState
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
// Crearemos este servicio en el siguiente paso
// import { createPatientProfile } from "../../../services/patientService";

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import styles from "./PatientProfileSetup.module.css"; // CSS que creamos antes

// Esquema de validación con Zod
const schema = z.object({
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"), // O usar z.date() si prefieres
  therapy_goals: z.string().min(10, "Describe brevemente tus objetivos (mín. 10 caracteres)").max(500, "Máximo 500 caracteres"),
  medical_history: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")), // Opcional
});

export default function PatientProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para la foto (igual que en PsychologistProfileSetup)
  const [photoPreview, setPhotoPreview] = useState(null); // URL temporal para vista previa
  const [photoDataUrl, setPhotoDataUrl] = useState(null); // Base64 para "guardar"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      birth_date: "",
      therapy_goals: "",
      medical_history: "",
    },
  });

  // Manejador onPhotoChange (igual que en PsychologistProfileSetup)
  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview temporal
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    // Convertir a Data URL (base64) para "guardar"
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result); // Guardar base64 en estado
    reader.readAsDataURL(file);
  };


  const onSubmit = async (values) => {
    try {
      // Incluir photoDataUrl en el objeto a enviar (o loggear)
      console.log("Datos a enviar (mock):", {
         user_id: user?.id,
         ...values,
         photo_url: photoDataUrl // <-- Foto añadida aquí
        });
      // const profileData = await createPatientProfile({ user_id: user?.id, ...values, photo_url: photoDataUrl }); // <-- Añadir photo_url si el backend lo soporta
      alert("Perfil de paciente guardado (simulación con foto en consola).");
      navigate("/app"); // O a donde corresponda
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el perfil del paciente.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Completa tu perfil</h1>
          <p className={styles.subtitle}>
            Ayúdanos a conocerte un poco mejor para encontrar al profesional adecuado para ti.
          </p>

          {/* Sección de la foto */}
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>
              {photoPreview ? (
                <img src={photoPreview} alt="Vista previa" className={styles.photoPreview} />
              ) : (
                <span>Seleccionar foto</span>
              )}
              {/* Input oculto */}
              <input
                type="file"
                accept="image/*" // Aceptar solo imágenes
                onChange={onPhotoChange}
                hidden // Ocultar el input por defecto
              />
            </label>
            <p className={styles.photoHint}>Sube tu foto de perfil (opcional)</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Fecha de Nacimiento */}
            <TextInput
              label="Fecha de Nacimiento"
              type="date"
              error={errors.birth_date?.message}
              {...register("birth_date")}
            />

            {/* Campo Objetivos de Terapia */}
            <div className={styles.group}>
              <label className={styles.label}>Objetivos de Terapia</label>
              <textarea
                rows={4}
                placeholder="¿Qué te gustaría trabajar o mejorar? (Ej: manejar ansiedad, mejorar relaciones, autoconocimiento...)"
                className={styles.textarea}
                {...register("therapy_goals")}
              />
              {errors.therapy_goals && (
                <p className={styles.error}>{errors.therapy_goals.message}</p>
              )}
            </div>

            {/* Campo Historial Médico */}
            <div className={styles.group}>
              <label className={styles.label}>Historial Médico Relevante (Opcional)</label>
              <textarea
                rows={3}
                placeholder="¿Alguna condición médica o medicación actual que consideres importante mencionar?"
                className={styles.textarea}
                {...register("medical_history")}
              />
              {errors.medical_history && (
                <p className={styles.error}>{errors.medical_history.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar Perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}