import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPatientProfileById } from "../../../services/patientService";
import styles from "./MyPatientProfile.module.css";

export default function PatientProfileView() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setError("ID de paciente inválido.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profile = await getPatientProfileById(id);
        if (!profile) {
          setError("Este paciente aún no tiene un perfil completado.");
          setPatientData(null);
        } else {
          setPatientData(profile);
        }
      } catch (err) {
        console.error("Error cargando perfil de paciente:", err);
        setError(
          err?.response?.data?.message ||
            "No se pudo cargar el perfil del paciente."
        );
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingCard}>Cargando perfil del paciente...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={`${styles.card} ${styles.errorCard}`}>{error}</div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.mutedText}>
            Este paciente todavía no completó su perfil.
          </p>
        </div>
      </div>
    );
  }

  const fallbackInitial = patientData.user?.first_name
    ? patientData.user.first_name[0].toUpperCase()
    : "P";
  const photoToShow = patientData.photo || patientData.user?.avatar;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.mainTitle}>Perfil del Paciente</h1>

          <section className={styles.headerSection}>
            <div className={styles.avatar}>
              {photoToShow ? (
                <img src={photoToShow} alt="Foto del paciente" />
              ) : (
                <div className={styles.avatarFallback}>{fallbackInitial}</div>
              )}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.name}>
                {patientData.user?.first_name || "Paciente"}{" "}
                {patientData.user?.last_name || ""}
              </h2>
              <p className={styles.email}>
                {patientData.user?.email || "Sin correo"}
              </p>
            </div>
            <Link to="/app/dashboard" className={styles.editButton}>
              Volver al panel
            </Link>
          </section>

          <section className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Detalles de Terapia</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha de Nacimiento</span>
              <span className={styles.detailValue}>
                {patientData.birth_date || "N/D"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Género</span>
              <span className={styles.detailValue}>
                {patientData.gender || "N/D"}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Objetivos de Terapia</span>
              <div className={styles.detailValueBlock}>
                {patientData.therapy_goals || "No especificados"}
              </div>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                Historial Médico Relevante
              </span>
              <div className={styles.detailValueBlock}>
                {patientData.medical_history || "No especificado"}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
