import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/apiClient";
import styles from "./SetPassword.module.css"; 

function SetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirm) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            await api.post(`/auth/set-password/${token}`, { password });
            setSuccess("✅ Contraseña establecida correctamente. Redirigiendo...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Error al establecer la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.setPasswordWrapper}>
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>🔐 Establecer Nueva Contraseña</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label className={styles.label}>Nueva contraseña</label>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formField}>
                            <label className={styles.label}>Confirmar contraseña</label>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar contraseña"}
                        </button>
                    </div>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {success && <p className={styles.successMessage}>{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default SetPassword;
