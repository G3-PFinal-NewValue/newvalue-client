import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/common/TextInput";
import PasswordInput from "../../components/common/PasswordInput";
import { Link } from "react-router-dom";
import { loginRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const user = await loginRequest(values);
      login(user); // guarda en contexto
      navigate("/"); // entra al home
    } catch (e) {
      alert("Login failed");
    }
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
        <p className="text-sm text-gray-600 mb-6">Coramind</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            label="Password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md px-4 py-2 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Loading..." : "Sign in"}
          </button>
          <div className="text-sm text-center text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-indigo-600">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
