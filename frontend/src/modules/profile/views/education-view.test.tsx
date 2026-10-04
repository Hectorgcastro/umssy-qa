import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { educationsService } from "../services/educations.service";
import type { EducationItem } from "../types/education-item.types";
import { EducationView } from "./education-view";

vi.mock("../services/educations.service", () => ({
  educationsService: { getEducations: vi.fn() },
}));

const EDUCATIONS: EducationItem[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    institution: "Example University",
    degree: "Computer Science",
    startDate: "2021-02-01",
    endDate: "2025-11-30",
    description: "Software development studies.",
    createdAt: "2025-12-01T00:00:00.000Z",
    updatedAt: "2025-12-01T00:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    institution: "Example School",
    degree: "High School Diploma",
    startDate: "2015-02-01",
    endDate: "2020-11-30",
    description: null,
    createdAt: "2025-12-01T00:00:00.000Z",
    updatedAt: "2025-12-01T00:00:00.000Z",
  },
];

describe("EducationView", () => {
  beforeEach(() => {
    vi.mocked(educationsService.getEducations).mockResolvedValue(EDUCATIONS);
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("shows multiple records from the API with their institution, degree, period and description", async () => {
    render(<EducationView />);

    expect(screen.getByRole("heading", { level: 1, name: "Trayectoria" })).toBeInTheDocument();
    const list = await screen.findByRole("list", { name: "Formación registrada" });
    const records = within(list).getAllByRole("listitem");

    expect(records).toHaveLength(2);
    expect(within(records[0]).getByRole("heading", { name: "Computer Science" })).toBeInTheDocument();
    expect(records[0]).toHaveTextContent("Example University · Feb 2021 – Nov 2025");
    expect(records[0]).toHaveTextContent("Software development studies.");
    expect(within(records[1]).getByRole("heading", { name: "High School Diploma" })).toBeInTheDocument();
    expect(records[1]).toHaveTextContent("Example School · Feb 2015 – Nov 2020");
    expect(records[1].querySelectorAll("p")).toHaveLength(1);
    expect(screen.queryByText("Ingeniería Informática")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows loading without showing an empty list while waiting for the API", () => {
    vi.mocked(educationsService.getEducations).mockReturnValue(new Promise(() => {}));
    render(<EducationView />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando formación académica...");
    expect(screen.queryByRole("list", { name: "Formación registrada" })).not.toBeInTheDocument();
    expect(screen.queryByText("Todavía no tienes formación académica registrada.")).not.toBeInTheDocument();
  });

  it("shows the empty state when the API returns no records", async () => {
    vi.mocked(educationsService.getEducations).mockResolvedValue([]);
    render(<EducationView />);

    expect(await screen.findByText("Todavía no tienes formación académica registrada.")).toBeInTheDocument();
    expect(screen.queryByText("Cargando formación académica...")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a Spanish load error without showing the empty state or sample data", async () => {
    vi.mocked(educationsService.getEducations).mockRejectedValue(new Error("Internal server error"));
    render(<EducationView />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo cargar tu formación académica. Recarga la página para intentarlo de nuevo.",
    );
    expect(screen.queryByText("Todavía no tienes formación académica registrada.")).not.toBeInTheDocument();
    expect(screen.queryByText("Cargando formación académica...")).not.toBeInTheDocument();
    expect(screen.queryByText("Internal server error")).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Formación registrada" })).not.toBeInTheDocument();
  });

  it("displays records with a missing end date and an empty description", async () => {
    vi.mocked(educationsService.getEducations).mockResolvedValue([
      { ...EDUCATIONS[0], endDate: null, description: "" },
    ]);
    render(<EducationView />);

    const list = await screen.findByRole("list", { name: "Formación registrada" });
    expect(list).toHaveTextContent("Feb 2021 – Fecha de fin no registrada");
    expect(list.querySelectorAll("p")).toHaveLength(1);
  });

  it("renders the four numbered trajectory sub-tabs with education as active", async () => {
    render(<EducationView />);
    await screen.findByRole("list", { name: "Formación registrada" });

    const list = screen.getByRole("list", { name: "Sub-secciones de trayectoria" });

    expect(list).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Formación académica")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Experiencia laboral")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("Habilidades")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.getByText("Certificaciones")).toBeInTheDocument();
  });

  it("marks Trayectoria as the active tab", async () => {
    render(<EducationView />);
    await screen.findByRole("list", { name: "Formación registrada" });

    expect(screen.getByRole("link", { name: "Trayectoria" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Datos personales" })).not.toHaveAttribute("aria-current");
  });

  it("shows the existing form fields and save button", async () => {
    render(<EducationView />);
    await screen.findByRole("list", { name: "Formación registrada" });

    expect(screen.getByLabelText(/Institución/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título o carrera/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Desde/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hasta/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción \(opcional\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar formación" })).toBeInTheDocument();
  });

  it("prevents the page reload when the existing form is submitted", async () => {
    render(<EducationView />);
    await screen.findByRole("list", { name: "Formación registrada" });

    const form = screen.getByRole("form", { name: "Agregar formación" });
    const wasNotPrevented = fireEvent.submit(form);

    expect(wasNotPrevented).toBe(false);
  });
});
