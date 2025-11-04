import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import PasswordInput from "../../../components/common/PasswordInput/PasswordInput.jsx";
import AuthTabs from "../../../components/auth/AuthTabs";
import { useAuth } from "../../../context/AuthContext";
import { registerRequest } from "../../../services/authService";

import styles from "../RegisterPage/RegisterPage.module.css";
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton.jsx";

// Esquema específico para profesionales
const professionalSchema = z
  .object({
    first_name: z.string().min(2, "El nombre es obligatorio"),
    last_name: z.string().min(2, "El apellido es obligatorio"),
    email: z.string().email("Correo inválido"),
    phone: z.string().min(8, "Teléfono inválido (mín. 8 dígitos)"),
    dni_nie_cif: z.string().min(5, "DNI/NIE/CIF es obligatorio"),
    full_address: z.string().min(5, "La dirección es obligatoria"),
    city: z.string().min(2, "La ciudad es obligatoria"),
    province: z.string().min(2, "La provincia es obligatoria"),
    postal_code: z.string().min(4, "El código postal es obligatorio"),
    country: z.string().min(2, "El país es obligatorio"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Confirma tu contraseña"),
    role: z.literal("psychologist"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export default function RegisterProfessionalPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      dni_nie_cif: "",
      full_address: "",
      city: "",
      province: "",
      postal_code: "",
      country: "",
      password: "",
      confirm: "",
      role: "psychologist",
    },
  });

  const onSubmit = async (values) => {
    try {
      const user = await registerRequest(values);
      login(user);
      // Los profesionales siempre van al setup de perfil profesional
      navigate("/app/profile");
    } catch (err) {
      alert(`Error al registrarse: ${err.message || "Error desconocido"}`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <AuthTabs />

        <div className={styles.card}>
          <h1 className={styles.title}>Únete como Profesional</h1>
          <p className={styles.subtitle}>
            Forma parte de nuestro equipo de psicólogos y genera impacto
            positivo
          </p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <GoogleSignInButton mode="signup" />

            {/* Datos Personales */}
            <TextInput
              label="Nombre"
              placeholder="Nombre"
              error={errors.first_name?.message}
              {...register("first_name")}
            />

            <TextInput
              label="Apellido"
              placeholder="Apellido"
              error={errors.last_name?.message}
              {...register("last_name")}
            />

            <TextInput
              label="DNI / NIE / CIF"
              placeholder="00000000X"
              error={errors.dni_nie_cif?.message}
              {...register("dni_nie_cif")}
            />

            {/* Datos de Contacto */}
            <TextInput
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <TextInput
              label="Teléfono de Contacto"
              placeholder="+34 600 000 000"
              error={errors.phone?.message}
              {...register("phone")}
            />

            {/* Datos de Dirección */}
            <TextInput
              label="Dirección Completa"
              placeholder="Calle Falsa, 123, 4B"
              error={errors.full_address?.message}
              {...register("full_address")}
            />
            <TextInput
              label="Ciudad"
              placeholder="Madrid"
              error={errors.city?.message}
              {...register("city")}
            />
            <TextInput
              label="Provincia"
              placeholder="Madrid"
              error={errors.province?.message}
              {...register("province")}
            />
            <TextInput
              label="Código Postal"
              placeholder="28001"
              error={errors.postal_code?.message}
              {...register("postal_code")}
            />
            <TextInput
              label="País"
              placeholder="España"
              error={errors.country?.message}
              {...register("country")}
            />

            {/* Datos de Seguridad */}
            <PasswordInput
              label="Contraseña"
              error={errors.password?.message}
              {...register("password")}
            />

            <PasswordInput
              label="Confirmar contraseña"
              error={errors.confirm?.message}
              {...register("confirm")}
            />

            {/* Información sobre el tipo de cuenta */}
            <div className={styles.roleGroup}>
              <div className={styles.professionalInfo}>
                <h4>Registro como Profesional</h4>
                <p>
                  Te estás registrando como psicólogo/a profesional. Podrás
                  crear tu perfil, gestionar tu calendario de disponibilidad por fechas específicas y ofrecer
                  sesiones online.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Unirse como Profesional"}
            </button>

            <div className={styles.footerLink}>
              <Link to="/register">¿Eres paciente? Regístrate aquí</Link> |{" "}
              <Link to="/">Ir a Home</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
