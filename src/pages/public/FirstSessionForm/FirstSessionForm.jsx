import { useState } from "react";
import styles from "./FirstSessionForm.module.css";

const FirstSessionForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value.trim();
        const repeatEmail = e.target.repeatEmail.value.trim();
        const password = e.target.password.value;
        const repeatPassword = e.target.repeatPassword.value;
        const phone = e.target.phone.value.trim();

        // Validaciones
        if (email !== repeatEmail) return alert("Los correos electrónicos no coinciden");
        if (password !== repeatPassword) return alert("Las contraseñas no coinciden");
        const phoneRegex = /^[+]?[\d\s()-]+$/;
        if (!phoneRegex.test(phone)) return alert("Teléfono inválido");

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

            const data = await response.json();
            alert("Usuario creado y correo enviado correctamente");
            e.target.reset();
        } catch (error) {
            console.error("Error enviando formulario:", error);
            alert(error.message);
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
                            Selecciona tu disponibilidad (día) *
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
