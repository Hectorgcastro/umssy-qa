import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ProfilePage from "./page";

describe("Profile page (Formación académica)", () => {
  afterEach(() => {
    cleanup();
  });

  it("muestra el título y los registros de formación existentes", () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Formación académica" }),
    ).toBeDefined();
    expect(screen.getByText("Ingeniería Informática")).toBeDefined();
    expect(screen.getByText("Bachiller en Humanidades")).toBeDefined();
    expect(screen.getByRole("button", { name: "Editar Ingeniería Informática" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Eliminar Ingeniería Informática" })).toBeDefined();
  });

  it("marca Trayectoria como la pestaña activa", () => {
    render(<ProfilePage />);

    const activeTab = screen.getByRole("button", { name: "Trayectoria" });
    expect(activeTab.getAttribute("aria-current")).toBe("page");
    expect(
      screen.getByRole("button", { name: "Documentos" }).getAttribute("aria-current"),
    ).toBeNull();
  });

  it("muestra el formulario con sus campos y el botón de guardar", () => {
    render(<ProfilePage />);

    expect(screen.getByLabelText(/Institución/)).toBeDefined();
    expect(screen.getByLabelText(/Título o carrera/)).toBeDefined();
    expect(screen.getByLabelText(/Desde/)).toBeDefined();
    expect(screen.getByLabelText(/Hasta/)).toBeDefined();
    expect(screen.getByLabelText(/Descripción \(opcional\)/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Guardar formación" })).toBeDefined();
  });

  it("evita la recarga de la página al enviar el formulario", () => {
    render(<ProfilePage />);

    const form = screen.getByRole("form", { name: "Agregar formación" });
    const wasNotPrevented = fireEvent.submit(form);

    expect(wasNotPrevented).toBe(false);
  });
});
