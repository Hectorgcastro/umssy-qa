import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ApiResponse, PaginatedData } from "@/shared/types/api-response.types";
import { REPORT_PAGE_SIZE, usePaginatedReport, type FetchReportPage } from "./use-paginated-report";

const ERROR_MESSAGE = "No se pudo cargar el reporte.";

function buildResponse(items: string[], totalItems: number): ApiResponse<PaginatedData<string>> {
  return {
    statusCode: 200,
    data: { items, totalItems },
    detail: "ok",
    ok: true,
  };
}

function resolvingWith(totalItems: number): FetchReportPage<string> {
  return vi.fn(async (page: number) => buildResponse([`item-${page}`], totalItems));
}

describe("usePaginatedReport", () => {
  it("empieza cargando y luego expone la página pedida", async () => {
    const fetchPage = resolvingWith(3);
    const { result } = renderHook(() => usePaginatedReport(fetchPage, 1, ERROR_MESSAGE));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual(["item-1"]);
    expect(fetchPage).toHaveBeenCalledWith(1, REPORT_PAGE_SIZE);
  });

  it("pide siempre lotes de 10 registros", async () => {
    const fetchPage = resolvingWith(50);
    const { rerender } = renderHook(({ page }) => usePaginatedReport(fetchPage, page, ERROR_MESSAGE), {
      initialProps: { page: 1 },
    });

    rerender({ page: 4 });

    await waitFor(() => expect(fetchPage).toHaveBeenCalledWith(4, 10));
    expect(REPORT_PAGE_SIZE).toBe(10);
  });

  it.each([
    { totalItems: 0, expectedPages: 1 },
    { totalItems: 1, expectedPages: 1 },
    { totalItems: 10, expectedPages: 1 },
    { totalItems: 11, expectedPages: 2 },
    { totalItems: 21, expectedPages: 3 },
  ])("con $totalItems registros muestra $expectedPages página(s)", async ({ totalItems, expectedPages }) => {
    const fetchPage = resolvingWith(totalItems);
    const { result } = renderHook(() => usePaginatedReport(fetchPage, 1, ERROR_MESSAGE));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.totalItems).toBe(totalItems);
    expect(result.current.totalPages).toBe(expectedPages);
  });

  it("descarta la respuesta de un filtro anterior que llega tarde", async () => {
    let resolveOldFilter: (value: ApiResponse<PaginatedData<string>>) => void = () => undefined;
    const oldFilter: FetchReportPage<string> = () => new Promise((resolve) => (resolveOldFilter = resolve));
    const newFilter: FetchReportPage<string> = async () => buildResponse(["mentor-1"], 1);
    const { result, rerender } = renderHook(({ fetchPage }) => usePaginatedReport(fetchPage, 1, ERROR_MESSAGE), {
      initialProps: { fetchPage: oldFilter },
    });

    rerender({ fetchPage: newFilter });
    await waitFor(() => expect(result.current.items).toEqual(["mentor-1"]));

    await act(async () => resolveOldFilter(buildResponse(["empresa-1", "empresa-2"], 2)));

    expect(result.current.items).toEqual(["mentor-1"]);
    expect(result.current.totalItems).toBe(1);
  });

  it("vuelve a consultar la misma página al refrescar", async () => {
    const fetchPage = resolvingWith(3);
    const { result } = renderHook(() => usePaginatedReport(fetchPage, 2, ERROR_MESSAGE));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.refresh());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(fetchPage).toHaveBeenLastCalledWith(2, REPORT_PAGE_SIZE);
  });

  it("expone el mensaje de error si falla la consulta", async () => {
    const fetchPage: FetchReportPage<string> = () => Promise.reject(new Error("Network error"));
    const { result } = renderHook(() => usePaginatedReport(fetchPage, 1, ERROR_MESSAGE));

    await waitFor(() => expect(result.current.errorMessage).toBe(ERROR_MESSAGE));
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
