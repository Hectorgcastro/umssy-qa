import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OrientationStep } from "./orientation-step";

afterEach(cleanup);

describe("OrientationStep", () => {
  it("muestra las opciones de orientación", () => {
    render(
      <OrientationStep
        selectedOrientationTypeIds={[]}
        onSelectionChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Orientación profesional")).toBeDefined();
    expect(screen.getByText("Orientación técnica")).toBeDefined();
    expect(screen.getByText("Búsqueda de empleo")).toBeDefined();
    expect(
      screen.getByText("Preparación para entrevistas"),
    ).toBeDefined();
  });

  it("muestra el contador en cero inicialmente", () => {
    render(
      <OrientationStep
        selectedOrientationTypeIds={[]}
        onSelectionChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Orientaciones seleccionadas: 0"),
    ).toBeDefined();
  });

  it("agrega una orientación al seleccionarla", () => {
    const onSelectionChange = vi.fn();

    render(
      <OrientationStep
        selectedOrientationTypeIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    expect(onSelectionChange).toHaveBeenCalledWith([
      "career-guidance",
    ]);
  });

  it("quita una orientación si ya estaba seleccionada", () => {
    const onSelectionChange = vi.fn();

    render(
      <OrientationStep
        selectedOrientationTypeIds={[
          "career-guidance",
          "technical-guidance",
        ]}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Orientación profesional/i,
      }),
    );

    expect(onSelectionChange).toHaveBeenCalledWith([
      "technical-guidance",
    ]);
  });

  it("muestra la etiqueta Activo en las orientaciones seleccionadas", () => {
    render(
      <OrientationStep
        selectedOrientationTypeIds={["career-guidance"]}
        onSelectionChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Activo")).toBeDefined();
  });

  it("actualiza visualmente el contador según las selecciones recibidas", () => {
    render(
      <OrientationStep
        selectedOrientationTypeIds={[
          "career-guidance",
          "technical-guidance",
        ]}
        onSelectionChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Orientaciones seleccionadas: 2"),
    ).toBeDefined();
  });
});