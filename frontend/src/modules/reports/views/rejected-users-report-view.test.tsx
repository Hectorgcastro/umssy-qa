import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { reportsService } from "../services/reports.service";
import { RejectedUsersReportView } from "./rejected-users-report-view";

describe("RejectedUsersReportView", () => {
  afterEach(() => {
    cleanup();
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
    expect(screen.getAllByText("Observado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No presentó documento").length).toBeGreaterThan(0);
    expect(screen.getByText("Mostrando 1-10 de 24 usuarios")).toBeDefined();
  });

  it("navega a la última página", async () => {
    render(<RejectedUsersReportView />);
    await waitFor(() => {
      expect(screen.getByText("Juan Carlos Peres Rojas")).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: "Página 3" }));

    await waitFor(() => {
      expect(screen.getByText("Rocio Guzman Tapia")).toBeDefined();
    });
    expect(screen.getByText("Mostrando 21-24 de 24 usuarios")).toBeDefined();
  });

  it("muestra un mensaje cuando no hay usuarios rechazados", async () => {
    vi.spyOn(reportsService, "getRejectedUsers").mockResolvedValueOnce({
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
    vi.spyOn(reportsService, "getRejectedUsers").mockRejectedValueOnce(new Error("Network error"));

    render(<RejectedUsersReportView />);

    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar el reporte de usuarios rechazados.")).toBeDefined();
    });
  });
});
