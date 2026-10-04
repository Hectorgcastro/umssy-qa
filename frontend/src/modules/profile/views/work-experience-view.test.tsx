import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WORK_EXPERIENCE_FEEDBACK_MESSAGES } from "../config/work-experience-feedback.config";
import { workExperienceService } from "../services/work-experience.service";
import type { WorkExperienceItem } from "../types/work-experience-item.types";
import { WorkExperienceView } from "./work-experience-view";

vi.mock("../services/work-experience.service", () => ({
  workExperienceService: {
    getWorkExperiences: vi.fn(),
    createWorkExperience: vi.fn(),
    updateWorkExperience: vi.fn(),
  },
}));

const CURRENT_JOB: WorkExperienceItem = {
  id: "experience-1",
  companyName: "Synapse Labs",
  position: "Desarrolladora web junior",
  startDate: "2025-03-01",
  endDate: null,
  isCurrent: true,
  description: null,
};

const PAST_JOB: WorkExperienceItem = {
  id: "experience-2",
  companyName: "Tecnored",
  position: "Asistente de laboratorio",
  startDate: "2023-03-01",
  endDate: "2024-12-01",
  isCurrent: false,
  description: "Apoyo en prácticas de redes",
};

describe("WorkExperienceView", () => {
  beforeEach(() => {
    vi.mocked(workExperienceService.getWorkExperiences).mockResolvedValue([PAST_JOB, CURRENT_JOB]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows the saved experiences with their period", async () => {
    render(<WorkExperienceView />);

    expect(screen.getByRole("heading", { level: 1, name: "Trayectoria" })).toBeInTheDocument();
    expect(screen.getByText("Cargando experiencia laboral...")).toBeInTheDocument();
    expect(await screen.findByText("Desarrolladora web junior")).toBeInTheDocument();
    expect(screen.getByText(/Mar 2025 – Actualidad/)).toBeInTheDocument();
    expect(screen.getByText(/Mar 2023 – Dic 2024/)).toBeInTheDocument();
    expect(screen.getByText("Experiencia laboral").closest("li")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("shows the empty message when there are no experiences", async () => {
    vi.mocked(workExperienceService.getWorkExperiences).mockResolvedValue([]);
    render(<WorkExperienceView />);

    expect(await screen.findByText("Aún no registraste experiencia laboral.")).toBeInTheDocument();
  });

  it("shows an error when the experiences cannot be loaded", async () => {
    vi.mocked(workExperienceService.getWorkExperiences).mockRejectedValue(new Error("fail"));
    render(<WorkExperienceView />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      WORK_EXPERIENCE_FEEDBACK_MESSAGES.loadError,
    );
  });

  it("creates an experience and reloads the list", async () => {
    const user = userEvent.setup();
    vi.mocked(workExperienceService.createWorkExperience).mockResolvedValue(CURRENT_JOB);
    render(<WorkExperienceView />);
    await screen.findByText("Desarrolladora web junior");

    await user.type(screen.getByLabelText(/Empresa/), "Synapse Labs");
    await user.type(screen.getByLabelText(/Cargo/), "Desarrolladora web junior");
    await user.click(screen.getByRole("checkbox", { name: "Trabajo actualmente aquí" }));
    await user.click(screen.getByRole("button", { name: "Guardar experiencia" }));

    expect(workExperienceService.createWorkExperience).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Synapse Labs",
        position: "Desarrolladora web junior",
        endDate: null,
        isCurrent: true,
      }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      WORK_EXPERIENCE_FEEDBACK_MESSAGES.createSuccess,
    );
    await waitFor(() =>
      expect(workExperienceService.getWorkExperiences).toHaveBeenCalledTimes(2),
    );
    expect(screen.getByLabelText(/Empresa/)).toHaveValue("");
  });

  it("edits an experience from the list", async () => {
    const user = userEvent.setup();
    vi.mocked(workExperienceService.updateWorkExperience).mockResolvedValue(PAST_JOB);
    render(<WorkExperienceView />);
    await screen.findByText("Asistente de laboratorio");

    await user.click(screen.getByRole("button", { name: "Editar Asistente de laboratorio" }));

    expect(screen.getByRole("form", { name: "Editar experiencia" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa/)).toHaveValue("Tecnored");

    await user.click(screen.getByRole("button", { name: "Guardar experiencia" }));

    expect(workExperienceService.updateWorkExperience).toHaveBeenCalledWith(
      "experience-2",
      expect.objectContaining({ companyName: "Tecnored", endDate: "2024-12-01" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      WORK_EXPERIENCE_FEEDBACK_MESSAGES.updateSuccess,
    );
  });

  it("shows an error when an experience cannot be saved", async () => {
    const user = userEvent.setup();
    vi.mocked(workExperienceService.updateWorkExperience).mockRejectedValue(new Error("fail"));
    render(<WorkExperienceView />);
    await screen.findByText("Asistente de laboratorio");

    await user.click(screen.getByRole("button", { name: "Editar Asistente de laboratorio" }));
    await user.click(screen.getByRole("button", { name: "Guardar experiencia" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      WORK_EXPERIENCE_FEEDBACK_MESSAGES.updateError,
    );
  });

  it("goes back to the add form when the edition is cancelled", async () => {
    const user = userEvent.setup();
    render(<WorkExperienceView />);
    await screen.findByText("Asistente de laboratorio");

    await user.click(screen.getByRole("button", { name: "Editar Asistente de laboratorio" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("form", { name: "Agregar experiencia" })).toBeInTheDocument();
  });
});
