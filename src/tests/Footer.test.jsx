import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../components/common/Footer/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Mock del contexto de autenticación
vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

// Mock del módulo CSS
vi.mock("../components/common/Footer/footer.css", () => ({}));

const renderFooter = (mockUser = null) => {
  useAuth.mockReturnValue({ user: mockUser });
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe("Footer Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Render General", () => {
    it("debe renderizar el componente sin errores", () => {
      renderFooter();
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("debe mostrar el logo de Cora Mind", () => {
      renderFooter();
      const logo = screen.getByAltText("Cora Mind Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/images/coramind_logo_long.png");
    });

    it("debe mostrar el tagline", () => {
      renderFooter();
      const tagline = screen.getByText(
        "Cada sesión transforma bienestar personal en bienestar compartido."
      );
      expect(tagline).toBeInTheDocument();
    });
  });

  describe("Secciones de Navegación", () => {
    it("debe mostrar la sección CORA MIND con sus enlaces", () => {
      renderFooter();
      expect(screen.getByText("CORA MIND")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Quiénes somos/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Equipo/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Contáctanos/i })).toBeInTheDocument();
    });

    it("debe mostrar la sección PROYECTO SOCIAL", () => {
      renderFooter();
      expect(screen.getByText("PROYECTO SOCIAL")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Con Cora Mind/i })).toBeInTheDocument();
    });

    it("debe mostrar la sección RECURSOS GRATUITOS", () => {
      renderFooter();
      expect(screen.getByText("RECURSOS GRATUITOS")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Blog de psicología/i })).toBeInTheDocument();
    });

    it("debe mostrar la sección TRATAMIENTOS con todos los enlaces", () => {
      renderFooter();
      expect(screen.getByText("TRATAMIENTOS")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Ansiedad y estrés/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Estado de ánimo/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Autoestima/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Relaciones afectivas/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Pareja y familia/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Dependencia emocional/i })).toBeInTheDocument();
    });
  });

  describe("Autenticación - Usuario no autenticado", () => {
    it("debe mostrar 'ACCEDER' cuando el usuario no está autenticado", () => {
      renderFooter(null);
      const heading = screen.getByText("ACCEDER");
      expect(heading).toBeInTheDocument();
    });

    it("debe mostrar enlaces de login y registro para usuarios no autenticados", () => {
      renderFooter(null);
      expect(screen.getByRole("link", { name: /Iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Unirse como paciente/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Trabaja con nosotros/i })).toBeInTheDocument();
    });

    it("no debe mostrar enlaces de gestión para usuarios no autenticados", () => {
      renderFooter(null);
      expect(screen.queryByRole("link", { name: /Mi perfil/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /Mis citas/i })).not.toBeInTheDocument();
    });
  });

  describe("Autenticación - Usuario paciente", () => {
    it("debe mostrar 'GESTIÓN' cuando el usuario está autenticado", () => {
      renderFooter({ id: 1, role: "patient", name: "Juan" });
      const heading = screen.getByText("GESTIÓN");
      expect(heading).toBeInTheDocument();
    });

    it("debe mostrar enlaces de perfil y citas para pacientes", () => {
      renderFooter({ id: 1, role: "patient", name: "Juan" });
      expect(screen.getByRole("link", { name: /Mi perfil/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Mis citas/i })).toBeInTheDocument();
    });

    it("no debe mostrar enlaces de login para pacientes autenticados", () => {
      renderFooter({ id: 1, role: "patient", name: "Juan" });
      expect(screen.queryByRole("link", { name: /Iniciar sesión/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /Unirse como paciente/i })).not.toBeInTheDocument();
    });
  });

  describe("Autenticación - Usuario psicólogo", () => {
    it("debe mostrar enlaces específicos para psicólogos", () => {
      renderFooter({ id: 2, role: "psychologist", name: "Dra. María" });
      expect(screen.getByRole("link", { name: /Mi perfil profesional/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Mis citas/i })).toBeInTheDocument();
    });

    it("no debe mostrar el enlace de 'Mi perfil' de paciente para psicólogos", () => {
      renderFooter({ id: 2, role: "psychologist", name: "Dra. María" });
      expect(screen.queryByRole("link", { name: /^Mi perfil$/i })).not.toBeInTheDocument();
    });
  });

  describe("Autenticación - Usuario admin", () => {
    it("debe mostrar el dashboard para administradores", () => {
      renderFooter({ id: 3, role: "admin", name: "Admin" });
      expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    });

    it("no debe mostrar otros enlaces de gestión para admins", () => {
      renderFooter({ id: 3, role: "admin", name: "Admin" });
      expect(screen.queryByRole("link", { name: /Mi perfil/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /Mi perfil profesional/i })).not.toBeInTheDocument();
    });
  });

  describe("Footer Legal", () => {
    it("debe mostrar sección de legal con enlaces", () => {
      renderFooter();
      expect(screen.getByRole("link", { name: /Aviso legal/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Política de cookies/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Protección de datos/i })).toBeInTheDocument();
    });
  });

  describe("Navegación", () => {
    it("el logo debe enlazar a la página principal", () => {
      renderFooter();
      const logoLink = screen.getByRole("link", { name: /Cora Mind Logo/i });
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("debe tener un enlace a la página de psicólogos", () => {
      renderFooter();
      const psyLink = screen.getByRole("link", { name: /Equipo/i });
      expect(psyLink).toHaveAttribute("href", "/psychologists");
    });

    it("debe tener un enlace a contacto", () => {
      renderFooter();
      const contactLink = screen.getByRole("link", { name: /Contáctanos/i });
      expect(contactLink).toHaveAttribute("href", "/contacto");
    });

    it("debe tener un enlace al blog", () => {
      renderFooter();
      const blogLink = screen.getByRole("link", { name: /Blog de psicología/i });
      expect(blogLink).toHaveAttribute("href", "/blog");
    });
  });
});