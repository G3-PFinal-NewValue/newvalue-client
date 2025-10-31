import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FirstSessionForm.module.css";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext.jsx";

const FirstSessionForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);

    // Fechas mínimas y máximas para la selección de disponibilidad
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1); // mañana
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 4); // dentro de 4 meses
    const formatDate = (date) => date.toLocaleDateString("es-ES");

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value.trim();
        const repeatEmail = e.target.repeatEmail.value.trim();
        const password = e.target.password.value;
        const repeatPassword = e.target.repeatPassword.value;
        const phone = e.target.phone.value.trim();

        // Validaciones
        if (email !== repeatEmail) {
            await Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "Los correos electrónicos no coinciden",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        if (password !== repeatPassword) {
            await Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "Las contraseñas no coinciden",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        const phoneRegex = /^[+]?[\d\s()-]+$/;
        if (!phoneRegex.test(phone)) {
            await Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "Teléfono inválido",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        const availability = e.target.availability.value;
        const selectedDate = new Date(availability);
        if (selectedDate < minDate || selectedDate > maxDate) {
            await Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: `Selecciona una fecha entre ${formatDate(minDate)} y ${formatDate(maxDate)}.`,
                confirmButtonText: "Aceptar",
            });
            return;
        }

        if (!acceptedTerms) {
            await Swal.fire({
                icon: "warning",
                title: "Aviso",
                text: "Debe aceptar las Condiciones de uso y el Aviso de privacidad antes de continuar",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        const formData = {
            email,
            password,
            firstName: e.target.firstName.value.trim(),
            firstLastName: e.target.firstLastName.value.trim(),
            secondLastName: e.target.secondLastName.value.trim(),
            phone: e.target.phone.value.trim(),
            address: e.target.address.value.trim(),
            city: e.target.city.value.trim(),
            province: e.target.province.value.trim(),
            country: e.target.country.value.trim(),
            postalCode: e.target.postalCode.value.trim(),
            dni: e.target.dni.value.trim(),
            reason: e.target.reason.value.trim(),
            feeling: e.target.feeling.value.trim(),
            timeFeeling: e.target.timeFeeling.value.trim(),
            previousTherapy: e.target.previousTherapy.value.trim(),
            availability: e.target.availability.value,
        };

        try {
            const response = await fetch("http://localhost:4000/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el usuario");
            }

            // Login automático con email y password
            const loginResponse = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) throw new Error("Error iniciando sesión");

            const loginData = await loginResponse.json();
            console.log(loginData);
            localStorage.setItem("cm_auth", JSON.stringify({ user: loginData.user, token: loginData.token }));

            // Actualizar estado global
            login(loginData.user);

            await Swal.fire({
                icon: "success",
                title: "¡Solicitud de primera consulta enviada!",
                text: "Ahora puedes completar tu perfil para empezar tu terapia.",
                confirmButtonText: "Aceptar",
            });

            e.target.reset();
            navigate("/app/my-profile");

        } catch (error) {
            console.error("Error enviando formulario:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Primera sesión de terapia</h2>
            <form className={styles.form} onSubmit={handleSubmit}>

                {/* Información de acceso */}
                <div className={`${styles.row} ${styles.accessRow}`}>
                    <div className={styles.inputGroup}>
                        <input type="email" id="email" placeholder=" " required />
                        <label htmlFor="email">Correo electrónico *</label>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="email" id="repeatEmail" placeholder=" " required />
                        <label htmlFor="repeatEmail">Repetir correo electrónico *</label>
                    </div>
                </div>
                <div className={`${styles.row} ${styles.accessRow}`}>
                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="password">Contraseña *</label>
                        <span className={styles.togglePassword} onClick={togglePassword}>
                            {showPassword ? "🙉" : "🙈"}
                        </span>
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="repeatPassword"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="repeatPassword">Repetir contraseña *</label>
                        <span className={styles.togglePassword} onClick={togglePassword}>
                            {showPassword ? "🙉" : "🙈"}
                        </span>
                    </div>
                </div>

                {/* Información personal */}
                <fieldset className={styles.fieldset}>
                    <h3 className={styles.sectionTitle}>Información personal</h3>
                    <p>Si no estableces otros datos de facturación, tus facturas se generarán a este nombre.</p>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <div className={styles.inputGroup} data-order="1">
                                <input type="text" id="firstName" placeholder=" " required />
                                <label htmlFor="firstName">Nombre *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="3">
                                <input type="text" id="secondLastName" placeholder=" " required />
                                <label htmlFor="secondLastName">Segundo apellido *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="5">
                                <input type="tel" id="phone" placeholder=" " required />
                                <label htmlFor="phone">Teléfono *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="7">
                                <input type="text" id="postalCode" placeholder=" " required />
                                <label htmlFor="postalCode">Código postal *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="9">
                                <input type="text" id="province" placeholder=" " required />
                                <label htmlFor="province">Provincia *</label>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.inputGroup} data-order="2">
                                <input type="text" id="firstLastName" placeholder=" " required />
                                <label htmlFor="firstLastName">Primer apellido *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="4">
                                <input type="text" id="dni" placeholder=" " required />
                                <label htmlFor="dni">DNI / NIE / CIF *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="6">
                                <input type="text" id="address" placeholder=" " required />
                                <label htmlFor="address">Dirección completa *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="8">
                                <input type="text" id="city" placeholder=" " required />
                                <label htmlFor="city">Municipio *</label>
                            </div>
                            <div className={styles.inputGroup} data-order="10">
                                <input type="text" id="country" placeholder=" " required />
                                <label htmlFor="country">País *</label>
                            </div>

                        </div>
                    </div>
                </fieldset>

                {/* Preguntas adicionales */}
                <fieldset className={styles.fieldset}>
                    <h3 className={styles.sectionTitle}>Sobre tu situación</h3>
                    <p>Por favor, responde a estas preguntas para que podamos comprender mejor tus necesidades y asignarte al profesional más adecuado.</p>

                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                        <textarea id="reason" placeholder=" " required />
                        <label htmlFor="reason">
                            Describe brevemente para qué has decidido acudir a terapia *
                        </label>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                        <textarea id="feeling" placeholder=" " required />
                        <label htmlFor="feeling">
                            ¿Cómo de bien te sientes con tu situación actual? *
                        </label>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                        <input type="text" id="timeFeeling" placeholder=" " required />
                        <label htmlFor="timeFeeling">
                            ¿Cuánto tiempo hace que te sientes así? *
                        </label>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                        <textarea id="previousTherapy" placeholder=" " required />
                        <label htmlFor="previousTherapy">
                            ¿Has ido a terapia antes para tratar esto? ¿Qué te funcionó y qué no? *
                        </label>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                        <input
                            type="date"
                            id="availability"
                            placeholder=" "
                            required
                            min={minDate.toISOString().split("T")[0]}
                            max={maxDate.toISOString().split("T")[0]}
                        />

                        <label htmlFor="availability">
                            Selecciona tu disponibilidad (día) desde {formatDate(minDate)} hasta {formatDate(maxDate)}
                        </label>

                    </div>
                </fieldset>

                {/* Checkbox de aceptación */}
                <div className={styles.checkboxContainer}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            required
                        />
                        <span>
                            Al continuar, confirma que ha leído y está de acuerdo con las{" "}
                            <a href="#" target="_blank" rel="noopener noreferrer">Condiciones de uso de Cora Mind</a> y{" "}
                            <a href="#" target="_blank" rel="noopener noreferrer">Aviso de privacidad</a>, y acepta recibir SMS y correo electrónico con promociones y ofertas.
                        </span>
                    </label>
                </div>

                <button type="submit" className={styles.submitBtnForm}>
                    Solicitar primera consulta
                </button>
            </form>
        </div>
    );
};

export default FirstSessionForm;