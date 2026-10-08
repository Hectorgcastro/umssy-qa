import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as downloadFileModule from "@/shared/utils/download-file";
import { EXPORT_SUCCESS_DURATION_MS, EXPORT_SUCCESS_MESSAGE, useExportReportCsv } from "./use-export-report-csv";

const EXPORTED_FILE = { file: new Blob(["Usuario"], { type: "text/csv" }), fileName: "reporte.csv" };

describe("useExportReportCsv", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("muestra el mensaje de éxito al exportar y lo oculta después de unos segundos", async () => {
    vi.useFakeTimers();
    vi.spyOn(downloadFileModule, "downloadFile").mockImplementation(() => undefined);
    const exportReport = vi.fn().mockResolvedValue(EXPORTED_FILE);
    const { result } = renderHook(() => useExportReportCsv(exportReport));

    await act(async () => {
      await result.current.exportCsv();
    });

    expect(result.current.successMessage).toBe(EXPORT_SUCCESS_MESSAGE);
    expect(result.current.errorMessage).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(EXPORT_SUCCESS_DURATION_MS - 1);
    });
    expect(result.current.successMessage).toBe(EXPORT_SUCCESS_MESSAGE);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.successMessage).toBeUndefined();
  });

  it("no muestra el mensaje de éxito si la exportación falla", async () => {
    const downloadSpy = vi.spyOn(downloadFileModule, "downloadFile");
    const exportReport = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useExportReportCsv(exportReport));

    await act(async () => {
      await result.current.exportCsv();
    });

    expect(result.current.successMessage).toBeUndefined();
    expect(result.current.errorMessage).toBe("No se pudo exportar el reporte. Inténtalo de nuevo.");
    expect(downloadSpy).not.toHaveBeenCalled();
  });
});
