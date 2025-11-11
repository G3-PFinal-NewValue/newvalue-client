import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import TextInput from "../../../components/common/TextInput/TextInput.jsx";
// Si lo tienes directo en common/, usa: "../../../components/common/TextInput.jsx"
import PasswordInput from "../../../components/common/PasswordInput/PasswordInput.jsx";
// O "../../../components/common/PasswordInput.jsx"
import AuthTabs from "../../../components/auth/AuthTabs";
import { useAuth } from "../../../context/AuthContext";
import { loginRequest } from "../../../services/authService";

import styles from "./LoginPage.module.css";
import GoogleSignInButton from "../../../components/auth/GoogleSignInButton.jsx";
import Swal from "sweetalert2";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
  try {
    const authData = await loginRequest(values);
    login(authData);
    navigate("/");
  } catch {
    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: "Verifica tus credenciales e intenta nuevamente.",
      confirmButtonText: "Aceptar",
    });
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <AuthTabs />

        <div className={styles.card}>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>
            Bienvenido(a) de nuevo a Cora Mind
          </p>

          <GoogleSignInButton mode="signin"/>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
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
