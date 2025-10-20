import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../components/common/TextInput";
import PasswordInput from "../../components/common/PasswordInput";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerRequest } from "../../services/authService";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  confirm: z.string().min(6, "Confirm your password"),
  role: z.enum(["patient","psychologist"]),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } =
    useForm({
      resolver: zodResolver(schema),
      defaultValues: { name:"", email:"", password:"", confirm:"", role:"patient" }
    });

  const role = watch("role");
  const { login } = useAuth();


const onSubmit = async (values) => {
  try {
    const user = await registerRequest(values); // stub
    login(user);
    window.location.href = "/";
  } catch {
    alert("Registration failed");
  }
};

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>
        <p className="text-sm text-gray-600 mb-6">Coramind</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Name" placeholder="Jane Doe"
            error={errors.name?.message} {...register("name")} />

          <TextInput label="Email" placeholder="jane@example.com"
            error={errors.email?.message} {...register("email")} />

          <PasswordInput label="Password"
            error={errors.password?.message} {...register("password")} />

          <PasswordInput label="Confirm password"
            error={errors.confirm?.message} {...register("confirm")} />

          {/* Role toggle simple */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo de cuenta</label>
            <div className="grid grid-cols-2 gap-2">
              {["patient","psychologist"].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setValue("role", r, { shouldValidate: true })}
                  className={`rounded-md border px-3 py-2
                    ${role===r ? "bg-indigo-600 text-white border-indigo-600"
                               : "bg-white text-gray-700 border-gray-300"}`}
                >
                  {r === "patient" ? "Paciente" : "Psicólogo"}
                </button>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
          </div>

<button
  type="submit"
  disabled={isSubmitting}
  className="w-full rounded-md px-4 py-2 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
>
  {isSubmitting ? "Loading..." : "Sign in"}
</button>
          <div className="text-sm text-center text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-indigo-600">Crea tu cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
