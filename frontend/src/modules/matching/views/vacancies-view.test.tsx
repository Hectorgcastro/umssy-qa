import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VacanciesView } from "./vacancies-view";
import { VacancyDetailView } from "./vacancy-detail-view";

const mocks = vi.hoisted(() => ({ list: vi.fn(), detail: vi.fn() }));
vi.mock("../hooks/use-vacancies", () => ({ useVacancies: mocks.list, useVacancy: mocks.detail }));

describe("Vacancy views (#239 / #285)", () => {
  afterEach(() => { cleanup(); vi.resetAllMocks(); });
  it("provides loading, errors with retry and empty states", () => {
    mocks.list.mockReturnValue({ isPending: true });
    const { rerender } = render(<VacanciesView />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
    const refetch = vi.fn();
    mocks.list.mockReturnValue({ isError: true, refetch });
    rerender(<VacanciesView />);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(refetch).toHaveBeenCalled();
    mocks.list.mockReturnValue({ data: { items: [], total: 0, limit: 20 } });
    rerender(<VacanciesView />);
    expect(screen.getByRole("status")).toHaveTextContent("No hay oportunidades");
  });
  it("links to actual vacancy details and advances pagination", () => {
    mocks.list.mockReturnValue({ data: { items: [{ id: "v", title: "Developer", companyName: "UMSS", compatibility: 85 }], total: 40, limit: 20 } });
    render(<VacanciesView />);
    expect(screen.getByRole("link", { name: "Ver oportunidad" })).toHaveAttribute("href", "/vacantes/v");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "85");
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(mocks.list).toHaveBeenLastCalledWith(2);
  });
  it("shows detail score and lets the student return to the list", () => {
    mocks.detail.mockReturnValue({ data: { title: "Dev", companyName: "UMSS", description: "Python role", compatibility: 100, gap: { skills: [], academicRequirements: [], otherRequirements: [], experienceRequirements: [], missingSkills: [], complete: true } } });
    render(<VacancyDetailView id="v" />);
    expect(screen.getByRole("link", { name: "Volver" })).toHaveAttribute("href", "/vacantes");
    expect(screen.getByRole("status")).toHaveTextContent("no tienes habilidades ni requisitos pendientes");
  });
});
