import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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

  it("permite avanzar entre los pasos", () => {
    render(<MentorshipView />);

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

  it("deshabilita Continuar en el último paso", () => {
    render(<MentorshipView />);

    const nextButton = screen.getByRole("button", {
      name: /Continuar/i,
    });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(
      screen.getByText("Paso 4: Confirmación"),
    ).toBeDefined();

    expect(
      (nextButton as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("permite regresar al paso anterior", () => {
    render(<MentorshipView />);

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
      screen.getByText("Paso 1: Participación"),
    ).toBeDefined();
  });

  it("muestra el título principal del wizard", () => {
    render(<MentorshipView />);

    expect(
      screen.getByText("Participa como mentor"),
    ).toBeDefined();
  });
});