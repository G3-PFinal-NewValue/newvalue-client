import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/apiClient";
import "./SetPassword.module.css";

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
        <div className="setPasswordWrapper">
            <div className="formContainer">
                <h2 className="formTitle">🔐 Establecer Nueva Contraseña</h2>

                <form onSubmit={handleSubmit}>
                    <div className="formGrid">
                        <div className="formField">
                            <label className="label">Nueva contraseña</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="formField">
                            <label className="label">Confirmar contraseña</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="Repite tu contraseña"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="buttonContainer">
                        <button
                            type="submit"
                            className="primaryButton"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar contraseña"}
                        </button>
                    </div>

                    {error && <p className="errorMessage">{error}</p>}
                    {success && <p className="successMessage">{success}</p>}
                </form>
            </div>
        </div>
    );
}

export default SetPassword;
