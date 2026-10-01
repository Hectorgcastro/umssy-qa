import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiResponse, PaginatedData } from "@/shared/types/api-response.types";
import { reportsService } from "../services/reports.service";
import type { RejectedUser } from "../types/rejected-user.types";
import { RejectedUsersReportView } from "./rejected-users-report-view";

const REJECTED_USERS: RejectedUser[] = Array.from({ length: 24 }, (_, index) => ({
  id: `rejected-${index + 1}`,
  fullName: index === 0 ? "Juan Carlos Peres Rojas" : `Usuario rechazado ${index + 1}`,
  email: index === 0 ? "juan.perez@gmail.com" : `usuario${index + 1}@gmail.com`,
  identifier: `2019${index.toString().padStart(5, "0")}`,
  documentType: index === 1 ? "NIT" : "ACADEMIC_DEGREE",
  registeredAt: "2026-03-15T14:00:00.000Z",
}));

function buildResponse(page: number, limit: number, search = ""): ApiResponse<PaginatedData<RejectedUser>> {
  const filteredUsers = REJECTED_USERS.filter((user) => user.email.includes(search));
  const offset = (page - 1) * limit;

  return {
    statusCode: 200,
    data: { items: filteredUsers.slice(offset, offset + limit), totalItems: filteredUsers.length },
    page,
    detail: "Usuarios rechazados obtenidos correctamente",
    ok: true,
  };
}

describe("RejectedUsersReportView", () => {
  beforeEach(() => {
    vi.spyOn(reportsService, "getRejectedUsers").mockImplementation(async ({ page, limit, search }) =>
      buildResponse(page, limit, search),
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("muestra el título, el buscador, los botones y la primera página", async () => {
    render(<RejectedUsersReportView />);

    expect(screen.getByRole("heading", { name: "Reporte de usuarios rechazados" })).toBeDefined();
    expect(screen.getByPlaceholderText("Buscar por correo electrónico")).toBeDefined();
    expect(screen.getByRole("button", { name: "Actualizar" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Exportar CSV" })).toBeDefined();
    expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);

    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });
    expect(screen.getAllByText("Título académico").length).toBeGreaterThan(0);
    expect(screen.getByText("NIT")).toBeDefined();
    expect(screen.getByText("Mostrando 1-10 de 24 usuarios")).toBeDefined();
    expect(reportsService.getRejectedUsers).toHaveBeenCalledWith({ page: 1, limit: 10, search: "" });
  });

  it("navega a la última página", async () => {
    render(<RejectedUsersReportView />);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: "Página 3" }));

    await waitFor(() => {
      expect(screen.getByText("Usuario rechazado 24")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 21-24 de 24 usuarios")).toBeDefined();
  });

  it("busca por correo después de dejar de escribir y vuelve a la primera página", async () => {
    render(<RejectedUsersReportView />);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });
    fireEvent.click(screen.getByRole("button", { name: "Página 2" }));
    await waitFor(() => {
      expect(screen.getByText("Mostrando 11-20 de 24 usuarios")).toBeDefined();
    });

    vi.useFakeTimers();
    fireEvent.change(screen.getByPlaceholderText("Buscar por correo electrónico"), {
      target: { value: " juan.perez@ " },
    });
    expect(reportsService.getRejectedUsers).not.toHaveBeenCalledWith(expect.objectContaining({ search: "juan.perez@" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(screen.getByText("Mostrando 1-1 de 1 usuarios")).toBeDefined();
    });
    expect(reportsService.getRejectedUsers).toHaveBeenLastCalledWith({ page: 1, limit: 10, search: "juan.perez@" });
  });

  it("limpia la búsqueda con el botón de la x", async () => {
    render(<RejectedUsersReportView />);
    const searchInput = screen.getByPlaceholderText<HTMLInputElement>("Buscar por correo electrónico");

    expect(screen.queryByRole("button", { name: "Limpiar búsqueda" })).toBeNull();
    fireEvent.change(searchInput, { target: { value: "juan" } });
    fireEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));

    expect(searchInput.value).toBe("");
    expect(screen.queryByRole("button", { name: "Limpiar búsqueda" })).toBeNull();
  });

  it("muestra un mensaje cuando la búsqueda no encuentra usuarios", async () => {
    render(<RejectedUsersReportView />);

    fireEvent.change(screen.getByPlaceholderText("Buscar por correo electrónico"), {
      target: { value: "noexiste@correo.com" },
    });

    await waitFor(() => {
      expect(screen.getByText("No se encontraron usuarios rechazados con ese correo.")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 0-0 de 0 usuarios")).toBeDefined();
  });

  it("vuelve a cargar los datos al presionar Actualizar", async () => {
    render(<RejectedUsersReportView />);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Actualizar" }).disabled).toBe(true);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });
    expect(reportsService.getRejectedUsers).toHaveBeenCalledTimes(2);
  });

  it("muestra un mensaje cuando no hay usuarios rechazados", async () => {
    vi.mocked(reportsService.getRejectedUsers).mockResolvedValueOnce({
      statusCode: 200,
      data: { items: [], totalItems: 0 },
      detail: "Sin datos",
      ok: true,
    });

    render(<RejectedUsersReportView />);

    await waitFor(() => {
      expect(screen.getByText("No hay usuarios rechazados.")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 0-0 de 0 usuarios")).toBeDefined();
  });

  it("muestra un mensaje de error si falla la carga", async () => {
    vi.mocked(reportsService.getRejectedUsers).mockRejectedValueOnce(new Error("Network error"));

    render(<RejectedUsersReportView />);

    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar el reporte de usuarios rechazados.")).toBeDefined();
    });
  });
});
