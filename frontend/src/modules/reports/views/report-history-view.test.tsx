import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { reportsService } from "../services/reports.service";
import { ReportHistoryView } from "./report-history-view";

describe("ReportHistoryView", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("muestra el título, el breadcrumb y los reportes de la primera página", async () => {
    render(<ReportHistoryView />);

    expect(screen.getByRole("heading", { name: "Historial de Reportes Generados" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
    expect(screen.getAllByTestId("skeleton-row")).toHaveLength(5);

    await waitFor(() => {
      expect(screen.getByText("Lista_Usuarios_Activos_2026")).toBeDefined();
    });
    expect(screen.getAllByText("Lista de Usuarios").length).toBeGreaterThan(0);
    expect(screen.getByText("2026-09-28 19:45")).toBeDefined();
    expect(screen.queryByText("Rechazados_Julio_2026")).toBeNull();
  });

  it("cambia de página con la paginación", async () => {
    render(<ReportHistoryView />);
    await waitFor(() => {
      expect(screen.getByText("Lista_Usuarios_Activos_2026")).toBeDefined();
    });

    expect(screen.getByRole("button", { name: "Página anterior" }).hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Página siguiente" }));

    await waitFor(() => {
      expect(screen.getByText("Rechazados_Julio_2026")).toBeDefined();
    });
    expect(screen.queryByText("Lista_Usuarios_Activos_2026")).toBeNull();
    expect(screen.getByRole("button", { name: "Página 2" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Página siguiente" }).hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Página anterior" }));
    await waitFor(() => {
      expect(screen.getByText("Lista_Usuarios_Activos_2026")).toBeDefined();
    });
  });

  it("muestra un mensaje cuando no hay reportes", async () => {
    vi.spyOn(reportsService, "getReportHistory").mockResolvedValueOnce({
      statusCode: 200,
      data: { items: [], totalItems: 0 },
      detail: "Sin datos",
      ok: true,
    });

    render(<ReportHistoryView />);

    await waitFor(() => {
      expect(screen.getByText("Aún no se generaron reportes.")).toBeDefined();
    });
  });

  it("muestra un mensaje de error si falla la carga", async () => {
    vi.spyOn(reportsService, "getReportHistory").mockRejectedValueOnce(new Error("Network error"));

    render(<ReportHistoryView />);

    await waitFor(() => {
      expect(screen.getByText("No se pudo cargar el historial de reportes.")).toBeDefined();
    });
  });
});
