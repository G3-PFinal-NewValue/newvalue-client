import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/public/RegisterPage/RegisterPage";
import { describe, it, expect, vi } from "vitest";

// Mock del AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

// Mock del registerRequest
vi.mock("../services/authService", () => ({
  registerRequest: vi.fn().mockResolvedValue({ id: 1, first_name: "Test" }),
}));

describe("RegisterPage", () => {
  it("renderiza el formulario de registro con campos básicos", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Inputs con placeholder únicos
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Apellido/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/tucorreo@ejemplo.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Calle Falsa, 123, 4B/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/\+34 600/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/España/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/28001/i)).toBeTruthy();

    // Inputs con placeholder duplicado: city y province
    const [cityInput, provinceInput] = screen.getAllByPlaceholderText(/Madrid/i);
    expect(cityInput).toBeTruthy();
    expect(provinceInput).toBeTruthy();

    // Contraseña y confirmar contraseña: buscamos por role textbox y hidden true
    const passwordInputs = screen.getAllByRole("textbox", { hidden: true });
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);

    // Verificar que el botón de registro exista
    expect(
      screen.getByRole("button", { name: /Registrarse como Paciente/i })
    ).toBeTruthy();
  });
});
