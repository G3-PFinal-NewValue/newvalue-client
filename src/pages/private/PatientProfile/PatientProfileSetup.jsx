import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import { createPatientProfile } from "../../../services/patientService"; 

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import styles from "./PatientProfileSetup.module.css";


const schema = z.object({
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato AAAA-MM-DD"),
  
  gender: z.string().min(1, "El género es obligatorio"), 
  therapy_goals: z.string().min(10, "Mín. 10 caracteres").max(500, "Máx. 500 caracteres"),
  medical_history: z.string().max(500, "Máx. 500 caracteres").optional().or(z.literal("")),
});

export default function PatientProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      birth_date: "",
      gender: "", 
      therapy_goals: "",
      medical_history: "",
    },
  });

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

    
    formData.append('user_id', user.id);
    formData.append('birth_date', values.birth_date);
    formData.append('gender', values.gender); 
    formData.append('therapy_goals', values.therapy_goals);
    if (values.medical_history) { 
      formData.append('medical_history', values.medical_history);
    }


    if (photoFile) {
      formData.append('photo', photoFile);
    }

    console.log("Enviando FormData para crear perfil paciente:");
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
             console.log(`FormData entry: ${key}`, { name: value.name, type: value.type });
        } else {
             console.log(`FormData entry: ${key}`, value);
        }
    }


    try {
     
      await createPatientProfile(formData);
      alert("Perfil de paciente guardado con éxito.");
      navigate("/app/my-profile"); 

    } catch (e) {
      console.error("Error en onSubmit PatientProfileSetup:", e);
      alert(e?.response?.data?.message || e.message || "No se pudo guardar el perfil.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>Completa tu perfil</h1>
          <p className={styles.subtitle}>
            Ayúdanos a conocerte un poco mejor.
          </p>

          
          <div className={styles.photoSection}>
            <label className={styles.photoLabel}>
              {photoPreview ? (
                <img src={photoPreview} alt="Vista previa" className={styles.photoPreview} />
              ) : (
                <span>Seleccionar foto</span>
              )}
              <input type="file" accept="image/*" onChange={onPhotoChange} hidden />
            </label>
            <p className={styles.photoHint}>Sube tu foto de perfil (opcional)</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
           
            <TextInput
              label="Fecha de Nacimiento"
              type="date"
              error={errors.birth_date?.message}
              {...register("birth_date")}
            />

            
             <div className={styles.group}>
                <label className={styles.label}>Género</label>
                <select
                    
                    {...register("gender")}
                    className={`${styles.select} ${errors.gender ? styles.errorBorder : ''}`} 
                >
                    <option value="">Selecciona...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="No binario">No binario</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
                {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}
            </div>


            
            <div className={styles.group}>
              <label className={styles.label}>Objetivos de Terapia</label>
              <textarea
                rows={4}
                placeholder="¿Qué te gustaría trabajar o mejorar?"
                className={`${styles.textarea} ${errors.therapy_goals ? styles.errorBorder : ''}`}
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
                placeholder="Condiciones médicas o medicación actual relevante..."
                className={`${styles.textarea} ${errors.medical_history ? styles.errorBorder : ''}`}
                {...register("medical_history")}
              />
              {errors.medical_history && (
                <p className={styles.error}>{errors.medical_history.message}</p>
              )}
            </div>

           /}
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar Perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}