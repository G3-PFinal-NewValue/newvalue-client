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
            setError(err.response?.data?.message || "Error estableciendo contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setpassword-page">
            <div className="setpassword-card">
                <h2 className="setpassword-title">🔐 Establecer nueva contraseña</h2>

                <form onSubmit={handleSubmit} className="setpassword-form">
                    <div className="form-group">
                        <label>Nueva contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SetPassword;
