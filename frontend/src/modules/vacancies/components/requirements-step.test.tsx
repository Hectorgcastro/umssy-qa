import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RequirementsStep } from "./requirements-step";
import { VacancyConditions } from "../hooks/use-job-offer-form";

const mockConditions: VacancyConditions = {
  title: "",
  modality: null,
  mapsLink: "",
  contractType: "",
  category: "",
  vacancyCount: "",
  salary: "",
  languages: "",
  description: "",
  skills: [],
};

describe("RequirementsStep", () => {
  it("debe renderizar el textarea correctamente", () => {
    render(
      <RequirementsStep
        conditions={mockConditions}
        updateField={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Buscamos un desarrollador backend/i)).toBeDefined();
  });

  it("debe llamar a updateField al escribir en la descripción respetando el límite", () => {
    const updateFieldMock = vi.fn();
    render(
      <RequirementsStep
        conditions={mockConditions}
        updateField={updateFieldMock}
      />
    );

    const textarea = screen.getByPlaceholderText(/Buscamos un desarrollador backend/i);
    fireEvent.change(textarea, { target: { value: "Experiencia en React" } });

    expect(updateFieldMock).toHaveBeenCalledWith("description", "Experiencia en React");
  });

  it("debe agregar una habilidad a la lista al hacer clic en un chip no seleccionado", () => {
    const updateFieldMock = vi.fn();
    render(
      <RequirementsStep
        conditions={mockConditions}
        updateField={updateFieldMock}
      />
    );

    const pythonChip = screen.getByText("Python");
    fireEvent.click(pythonChip);

    expect(updateFieldMock).toHaveBeenCalledWith("skills", ["Python"]);
  });

  it("debe remover una habilidad si se hace clic en un chip ya seleccionado", () => {
    const updateFieldMock = vi.fn();
    const conditionsWithSkill = { ...mockConditions, skills: ["Python"] };

    render(
      <RequirementsStep
        conditions={conditionsWithSkill}
        updateField={updateFieldMock}
      />
    );

    const pythonChip = screen.getByText("Python");
    fireEvent.click(pythonChip);

    expect(updateFieldMock).toHaveBeenCalledWith("skills", []);
  });
});