import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPsychologistProfileById } from "../../../services/psychologistsService";
import styles from "./PsychologistPublicProfile.module.css";

const WEEKDAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

export default function PsychologistPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const p = getPsychologistProfileById(id);
    setProfile(p || null);
  }, [id]);

  const slotsByDay = useMemo(() => {
    if (!profile?.availabilities) return [];
    const grouped = profile.availabilities
      .slice()
      .sort((a,b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time))
      .reduce((acc, s) => {
        (acc[s.weekday] ||= []).push(s);
        return acc;
      }, {});
    return Object.entries(grouped).map(([day, arr]) => ({
      weekday: Number(day),
      slots: arr
    }));
  }, [profile]);

  if (profile === null) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.card}>
            <p className={styles.notFound}>Perfil no encontrado.</p>
            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>Volver</button>
              <Link className={styles.primaryBtn} to="/blog">Ir al Blog</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    photo_url,
    license_number,
    specialty,
    professional_description,
    user_id,
  } = profile;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.headerCard}>
          <div className={styles.avatar}>
            {photo_url
              ? <img src={photo_url} alt="Foto del profesional" />
              : <div className={styles.avatarFallback}>CM</div>}
          </div>

          <div className={styles.headerInfo}>
            <h1 className={styles.name}>
              Psicólogo/a #{user_id ?? "N/D"}
            </h1>
            <p className={styles.specialty}>{specialty || "Especialidad no especificada"}</p>
            <p className={styles.license}>Licencia: {license_number || "N/D"}</p>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sobre mí</h2>
            <p className={styles.description}>
              {professional_description || "Este profesional aún no ha añadido su descripción."}
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Disponibilidades</h2>
            {slotsByDay.length === 0 ? (
              <p className={styles.muted}>Sin horarios publicados.</p>
            ) : (
              <ul className={styles.availList}>
                {slotsByDay.map(({ weekday, slots }) => (
                  <li key={weekday} className={styles.dayRow}>
                    <span className={styles.dayName}>{WEEKDAYS[weekday]}</span>
                    <div className={styles.slots}>
                      {slots.map((s, idx) => (
                        <span key={idx} className={styles.slot}>
                          {s.start_time}–{s.end_time}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className={styles.footerActions}>
          <Link className={styles.secondaryBtn} to="/">Volver al inicio</Link>
          <Link className={styles.primaryBtn} to="/login">Reservar cita</Link>
        </div>
      </div>
    </div>
  );
}
