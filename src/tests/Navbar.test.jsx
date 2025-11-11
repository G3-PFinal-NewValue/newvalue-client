import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar.jsx";
import { describe, it, expect, vi } from "vitest";

// Mock directo de useAuth
const mockLogout = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "patient" }, logout: mockLogout }),
}));

describe("Navbar", () => {
  it("renderiza links públicos y del paciente", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Usamos getAllByText y tomamos el primero
    expect(screen.getAllByText(/Conócenos/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Mi Perfil/i)[0]).toBeInTheDocument();
  });

  it("llama a logout al hacer click en botón cerrar sesión", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getAllByText(/Cerrar sesión/i)[0];
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });
});
