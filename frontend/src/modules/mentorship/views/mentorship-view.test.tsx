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

    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();
  });

  it("no permite avanzar del paso 2 sin seleccionar un área", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

    expect((nextButton as HTMLButtonElement).disabled).toBe(true);

    expect(
      screen.getByText("Debe seleccionarse al menos un área para continuar"),
    ).toBeDefined();
  });

  it("permite avanzar del paso 2 al seleccionar al menos un área", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

    const backendCard = screen.getByRole("button", {
      name: /Backend/i,
    });

    fireEvent.click(backendCard);

    expect((nextButton as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", { name: "Tipos de orientación" }),
    ).toBeDefined();
  });

  it("deshabilita Volver en el primer paso", () => {
    render(<MentorshipView />);

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    expect((backButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("permite regresar al paso anterior", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);

    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

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

    expect(screen.getByText("Paso 2: Áreas técnicas")).toBeDefined();

    const backButton = screen.getByRole("button", {
      name: /Volver/i,
    });

    fireEvent.click(backButton);

    const participationCheckbox = screen.getByRole("checkbox");

    expect(
      (participationCheckbox as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("muestra el título principal del wizard", () => {
    render(<MentorshipView />);

    expect(screen.getByText("Participa como mentor")).toBeDefined();
  });

  it("actualiza el contador al seleccionar áreas", () => {
    render(<MentorshipView />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

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

  it("deshabilita Continuar en el último paso", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    // Paso 1 a paso 2
    fireEvent.click(nextButton);

    // Se selecciona un area para poder salir del paso 2
    fireEvent.click(screen.getByRole("button", { name: /Backend/i }));

    // Paso 2 a paso 3 y paso 3 a paso 4
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("Paso 4: Confirmación")).toBeDefined();
    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("muestra las orientaciones y permite seleccionar varias", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));
    const nextButton = screen.getByRole("button", { name: /Continuar/i });
    fireEvent.click(nextButton);
    fireEvent.click(screen.getByRole("button", { name: /Backend/i }));
    fireEvent.click(nextButton);

    fireEvent.click(
      screen.getByRole("button", { name: /Orientación profesional/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Orientación técnica/i }),
    );

    expect(screen.getByText("Orientaciones seleccionadas: 2")).toBeDefined();
    expect(screen.getAllByText("Activo")).toHaveLength(2);
  });

  it("conserva las orientaciones al avanzar y regresar", () => {
    render(<MentorshipView />);

    fireEvent.click(screen.getByRole("checkbox"));
    const nextButton = screen.getByRole("button", { name: /Continuar/i });
    fireEvent.click(nextButton);
    fireEvent.click(screen.getByRole("button", { name: /Backend/i }));
    fireEvent.click(nextButton);
    fireEvent.click(
      screen.getByRole("button", { name: /Orientación profesional/i }),
    );

    fireEvent.click(nextButton);
    expect(screen.getByText("Paso 4: Confirmación")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Volver/i }));
    expect(screen.getByText("Orientaciones seleccionadas: 1")).toBeDefined();
    expect(screen.getByText("Activo")).toBeDefined();
  });
});
