import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
import PasswordInput from "../../../components/common/PasswordInput/PasswordInput.jsx";
import AuthTabs from "../../../components/auth/AuthTabs";
import { useAuth } from "../../../context/AuthContext";
import { registerRequest } from "../../../services/authService";

import styles from "./RegisterPage.module.css";

const schema = z
  .object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Confirma tu contraseña"),
    role: z.enum(["patient", "psychologist"]),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      role: "patient",
    },
  });

  const onSubmit = async (values) => {
    try {
      const user = await registerRequest(values); // mock temporal
      login(user);
      navigate("/");
    } catch {
      alert("Error al registrarse");
    }
  };

  const role = watch("role");

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <AuthTabs />

        <div className={styles.card}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Únete a Cora Mind y comienza tu camino</p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Nombre completo"
              placeholder="Tu nombre"
              error={errors.name?.message}
              {...register("name")}
            />

            <TextInput
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

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

            {/* Selector de tipo de cuenta */}
            <div className={styles.roleGroup}>
              <label className={styles.label}>Tipo de cuenta</label>
              <div className={styles.roleButtons}>
                <button
                  type="button"
                  onClick={() => setValue("role", "patient", { shouldValidate: true })}
                  className={`${styles.roleButton} ${
                    role === "patient" ? styles.roleActive : ""
                  }`}
                >
                  Paciente
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "psychologist", { shouldValidate: true })
                  }
                  className={`${styles.roleButton} ${
                    role === "psychologist" ? styles.roleActive : ""
                  }`}
                >
                  Profesional
                </button>
              </div>
              {errors.role && (
                <p className={styles.errorText}>{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>

            <div className={styles.footerLink}>
              <Link to="/">Ir a Home</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
