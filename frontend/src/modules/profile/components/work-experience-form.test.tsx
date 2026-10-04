import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkExperienceForm } from "./work-experience-form";

describe("WorkExperienceForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("sends the typed values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<WorkExperienceForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    expect(screen.getByRole("form", { name: "Agregar experiencia" })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Empresa/), "Synapse Labs");
    await user.type(screen.getByLabelText(/Cargo/), "Desarrolladora web");
    await user.type(screen.getByLabelText(/Descripción de funciones/), "Interfaces con React");
    await user.click(screen.getByRole("button", { name: "Guardar experiencia" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Synapse Labs",
        position: "Desarrolladora web",
        description: "Interfaces con React",
        isCurrent: false,
      }),
    );
  });

  it("disables and clears the end date for a current job", async () => {
    const user = userEvent.setup();
    render(
      <WorkExperienceForm
        initialValues={{
          companyName: "Synapse Labs",
          position: "Desarrolladora web",
          startDate: "2024-07-01",
          endDate: "2024-12-31",
          isCurrent: false,
          description: "",
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const endDate = screen.getByLabelText("Hasta");
    expect(endDate).toHaveValue("2024-12-31");

    await user.click(screen.getByRole("checkbox", { name: "Trabajo actualmente aquí" }));

    expect(endDate).toBeDisabled();
    expect(endDate).toHaveValue("");
  });

  it("shows the edit title with the saved values", () => {
    render(
      <WorkExperienceForm
        initialValues={{
          companyName: "Synapse Labs",
          position: "Desarrolladora web",
          startDate: "2025-03-01",
          endDate: "",
          isCurrent: true,
          description: "",
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("form", { name: "Editar experiencia" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa/)).toHaveValue("Synapse Labs");
    expect(screen.getByRole("checkbox", { name: "Trabajo actualmente aquí" })).toBeChecked();
  });

  it("cancels and disables the buttons while saving", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { rerender } = render(<WorkExperienceForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalled();

    rerender(<WorkExperienceForm isPending onSubmit={vi.fn()} onCancel={onCancel} />);
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled();
  });

  it("shows the save feedback next to the buttons", () => {
    render(
      <WorkExperienceForm
        feedback={{ type: "error", message: "No se pudo agregar la experiencia laboral." }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo agregar la experiencia laboral.");
  });
});
