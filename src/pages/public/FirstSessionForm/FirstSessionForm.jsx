import React, { useState } from "react";
import styles from "./FirstSessionForm.module.css";

const FirstSessionForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        alert("Formulario enviado");
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
                            <div className={styles.inputGroup}>
                                <input type="text" id="firstName" placeholder=" " required />
                                <label htmlFor="firstName">Nombre *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="secondLastName" placeholder=" " required />
                                <label htmlFor="secondLastName">Segundo apellido *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="postalCode" placeholder=" " required />
                                <label htmlFor="postalCode">Código postal *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="province" placeholder=" " required />
                                <label htmlFor="province">Provincia *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="tel" id="phone" placeholder=" " required />
                                <label htmlFor="phone">Teléfono *</label>
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.inputGroup}>
                                <input type="text" id="firstLastName" placeholder=" " required />
                                <label htmlFor="firstLastName">Primer apellido *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="address" placeholder=" " required />
                                <label htmlFor="address">Dirección completa *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="city" placeholder=" " required />
                                <label htmlFor="city">Municipio *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="country" placeholder=" " required />
                                <label htmlFor="country">País *</label>
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" id="dni" placeholder=" " required />
                                <label htmlFor="dni">DNI / NIE / CIF *</label>
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
                        <input type="date" id="availability" placeholder=" " required />
                        <label htmlFor="availability">
                            Selecciona tu disponibilidad *
                        </label>
                    </div>
                </fieldset>


                <button type="submit" className={styles.submitBtnForm}>
                    Solicitar primera consulta
                </button>
            </form>
        </div>
    );
};

export default FirstSessionForm;
