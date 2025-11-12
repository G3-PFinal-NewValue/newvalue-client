import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyPatientProfile from "../pages/private/PatientProfile/MyPatientProfile.jsx";
import { describe, expect, it, vi } from "vitest";

// Mock del AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      avatar: null,
    },
  }),
}));

// Mock completo de patientService
import * as patientService from "../services/patientService.js";
vi.mock("../services/patientService");

describe("MyPatientProfile", () => {
  it("muestra el título y los datos del perfil si existen", async () => {
    // Mock del perfil existente
    (patientService.getPatientProfileById).mockResolvedValueOnce({
      user_id: 1,
      birth_date: "1990-01-01",
      gender: "Masculino",
      therapy_goals: "Reducir ansiedad",
      medical_history: "Ninguna",
      photo: null,
    });

    render(
      <MemoryRouter>
        <MyPatientProfile />
      </MemoryRouter>
    );

    // Esperamos que se muestre el título principal
    expect(await screen.findByText(/Mi Perfil/i)).toBeInTheDocument();

    // Verificamos que los datos del perfil aparezcan
    expect(screen.getByText(/1990-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Masculino/i)).toBeInTheDocument();
    expect(screen.getByText(/Reducir ansiedad/i)).toBeInTheDocument();
    expect(screen.getByText(/Ninguna/i)).toBeInTheDocument();

    // Botón debe decir "Editar Perfil"
    expect(screen.getByRole("link", { name: /Editar Perfil/i })).toBeInTheDocument();
  });

  it("muestra el mensaje de completar perfil si no hay datos", async () => {
    // Mock de perfil no creado
    (patientService.getPatientProfileById).mockResolvedValueOnce(null);

    render(
      <MemoryRouter>
        <MyPatientProfile />
      </MemoryRouter>
    );

    // Esperamos el mensaje de completar perfil
    expect(
      await screen.findByText(/Aún no has completado tu perfil/i)
    ).toBeInTheDocument();

    // Botón debe decir "Completar Perfil"
    expect(screen.getByRole("link", { name: /Completar Perfil/i })).toBeInTheDocument();
  });
});
