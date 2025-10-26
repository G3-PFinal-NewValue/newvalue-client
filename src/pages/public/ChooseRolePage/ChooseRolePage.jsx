import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/apiClient";
import styles from "./ChooseRolePage.module.css";

export default function ChooseRolePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectRole = async (role) => {
    if (!user?.id) {
      setError("No hay usuario autenticado");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.patch("/user/assign-role", {
        userId: user.id,
        roleName: role
      });

      const { user: updatedUser, token } = response.data;

      if (!updatedUser || !token) {
        throw new Error('Respuesta incompleta del servidor');
      }

      localStorage.setItem("cm_auth", JSON.stringify({ token, user: updatedUser }));
      login(updatedUser);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Error al asignar rol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>¿Qué tipo de cuenta deseas usar?</h1>
          <p className={styles.subtitle}>
            Selecciona el tipo de cuenta para continuar. Esta decisión ayuda a personalizar tu experiencia.
          </p>

          <div className={styles.roleGroup}>
            <label className={styles.label}>Tipo de cuenta</label>
            <div className={styles.roleButtons}>
              <button
                className={styles.roleButton}
                onClick={() => selectRole("patient")}
                disabled={loading}
              >
                {loading ? "Asignando..." : "Paciente"}
              </button>
              <button
                className={styles.roleButton}
                onClick={() => selectRole("psychologist")}
                disabled={loading}
              >
                {loading ? "Asignando..." : "Profesional"}
              </button>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <p className={styles.footerLink}>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}