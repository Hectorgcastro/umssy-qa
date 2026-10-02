import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import { MentorshipView } from "./mentorship-view";

afterEach(cleanup);

describe("MentorshipView", () => {
  it("renderiza inicialmente el paso 1", () => {
    render(<MentorshipView />);

    expect(screen.getByText("Paso 1: Participación")).toBeDefined();
    expect(
      screen.getByText("Configura tu participación como mentor"),
    ).toBeDefined();
  });

  it("permite avanzar al paso 2", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);
    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();
  });

  it("no permite avanzar del paso 2 sin seleccionar un área", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    // Ir al paso 2
    fireEvent.click(nextButton);
    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

    // Sin seleccionar área, Continuar debe estar deshabilitado
    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
    expect(
      screen.getByText("Debe seleccionarse al menos un área para continuar"),
    ).toBeDefined();
  });

  it("permite avanzar del paso 2 al seleccionar al menos un área", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    // Ir al paso 2
    fireEvent.click(nextButton);

    // Seleccionar un área (Backend)
    const backendCard = screen.getByRole("button", {
      name: /Backend/i,
    });
    fireEvent.click(backendCard);

    // Ahora Continuar debe habilitarse
    expect((nextButton as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(nextButton);
    expect(screen.getByText("Paso 3: Tipos de orientación")).toBeDefined();
  });

  it("deshabilita Volver en el primer paso", () => {
    render(<MentorshipView />);

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    expect((backButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("permite regresar al paso anterior conservando el estado", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);
    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);
    expect(screen.getByText("Paso 1: Participación")).toBeDefined();
  });

  it("muestra el título principal del wizard", () => {
    render(<MentorshipView />);

    expect(screen.getByText("Participa como mentor")).toBeDefined();
  });

  it("actualiza el contador al seleccionar áreas", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });
    fireEvent.click(nextButton);

    expect(screen.getByText("0 seleccionadas")).toBeDefined();

    const backendCard = screen.getByRole("button", {
      name: /Backend/i,
    });
    fireEvent.click(backendCard);

    expect(screen.getByText("1 seleccionada")).toBeDefined();
  });
});