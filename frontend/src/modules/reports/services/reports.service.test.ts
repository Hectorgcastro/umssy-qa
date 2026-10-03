import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { reportsService } from "./reports.service";

describe("reportsService.getReportHistory", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("consulta el endpoint del historial con la página y el límite", async () => {
    const response = {
      statusCode: 200,
      data: { items: [], totalItems: 0 },
      page: 2,
      detail: "Historial de reportes obtenido correctamente",
      ok: true,
    };
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: response });

    const result = await reportsService.getReportHistory({ page: 2, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith("/reports/history", { params: { page: 2, limit: 10 } });
    expect(result).toEqual(response);
  });
});

describe("reportsService.getRejectedUsers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("consulta el endpoint de rechazados con la página, el límite y la búsqueda", async () => {
    const response = {
      statusCode: 200,
      data: { items: [], totalItems: 0 },
      page: 2,
      detail: "Usuarios rechazados obtenidos correctamente",
      ok: true,
    };
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: response });

    const result = await reportsService.getRejectedUsers({ page: 2, limit: 10, search: "juan" });

    expect(getSpy).toHaveBeenCalledWith("/reports/rejected-users", {
      params: { page: 2, limit: 10, search: "juan" },
    });
    expect(result).toEqual(response);
  });

  it("no envía la búsqueda cuando está vacía", async () => {
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValueOnce({ data: {} });

    await reportsService.getRejectedUsers({ page: 1, limit: 10, search: "" });

    expect(getSpy).toHaveBeenCalledWith("/reports/rejected-users", {
      params: { page: 1, limit: 10, search: undefined },
    });
  });
});
