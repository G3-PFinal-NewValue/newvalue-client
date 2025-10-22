import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
// Crearemos este servicio en el siguiente paso
// import { createPatientProfile } from "../../../services/patientService"; 

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
// Necesitaremos un DateInput simple o podemos usar TextInput type="date"
import styles from "./PatientProfileSetup.module.css"; // Crearemos este CSS después

// Esquema de validación con Zod
const schema = z.object({
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"), // O usar z.date() si prefieres
  therapy_goals: z.string().min(10, "Describe brevemente tus objetivos (mín. 10 caracteres)").max(500, "Máximo 500 caracteres"),
  medical_history: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")), // Opcional
});

export default function PatientProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const onSubmit = async (values) => {
    try {
      console.log("Datos a enviar (mock):", { user_id: user?.id, ...values });
      // const profileData = await createPatientProfile({ user_id: user?.id, ...values }); // Descomentar cuando exista el servicio
      alert("Perfil de paciente guardado (simulación).");
      // Idealmente, redirigir a donde el paciente pueda ver psicólogos
      navigate("/app"); // O a '/app/dashboard' o similar
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

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {/* Usaremos TextInput con type="date" por simplicidad */}
            <TextInput
              label="Fecha de Nacimiento"
              type="date"
              error={errors.birth_date?.message}
              {...register("birth_date")}
            />

            <div className={styles.group}> {/* Similar al PsychologistProfileSetup */}
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

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar Perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}