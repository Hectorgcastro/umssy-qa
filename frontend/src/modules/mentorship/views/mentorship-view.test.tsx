import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MentorshipView } from "./mentorship-view";

afterEach(cleanup);

describe("MentorshipView", () => {
  it("renderiza inicialmente el paso 1 con participación desmarcada", () => {
    render(<MentorshipView />);

    expect(
      screen.getByRole("heading", { name: "Participación" }),
    ).toBeDefined();

    expect(
      screen.getByText("Quiero participar como mentor"),
    ).toBeDefined();

    const checkbox = screen.getByRole("checkbox");

    expect((checkbox as HTMLInputElement).checked).toBe(false);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("habilita Continuar al seleccionar participación", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    expect((nextButton as HTMLButtonElement).disabled).toBe(false);
  });

  it("permite avanzar entre los pasos después de aceptar participación", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 2: Áreas técnicas"),
    ).toBeDefined();

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", {
        name: "Tipos de orientación",
      }),
    ).toBeDefined();

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 4: Confirmación"),
    ).toBeDefined();

    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("deshabilita Volver en el primer paso", () => {
    render(<MentorshipView />);

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    expect(
      (backButton as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("permite regresar al paso anterior", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 2: Áreas técnicas"),
    ).toBeDefined();

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);

    expect(
      screen.getByRole("heading", { name: "Participación" }),
    ).toBeDefined();
  });

  it("conserva la participación al avanzar y regresar", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect((checkbox as HTMLInputElement).checked).toBe(true);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 2: Áreas técnicas"),
    ).toBeDefined();

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);

    const participationCheckbox = screen.getByRole("checkbox");

    expect(
      (participationCheckbox as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("conserva las orientaciones al avanzar y regresar", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    expect(
      screen.getByText("Orientaciones seleccionadas: 1"),
    ).toBeDefined();

    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 4: Confirmación"),
    ).toBeDefined();

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);

    expect(
      screen.getByRole("heading", {
        name: "Tipos de orientación",
      }),
    ).toBeDefined();

    expect(
      screen.getByText("Orientaciones seleccionadas: 1"),
    ).toBeDefined();

    expect(screen.getByText("Activo")).toBeDefined();
  });

  it("muestra el título principal del wizard", () => {
    render(<MentorshipView />);

    expect(
      screen.getByText("Participa como mentor"),
    ).toBeDefined();
  });
});