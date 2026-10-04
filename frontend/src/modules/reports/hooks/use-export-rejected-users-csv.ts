"use client";

import { useCallback } from "react";
import { reportsService } from "../services/reports.service";
import { useExportReportCsv } from "./use-export-report-csv";

// Exporta los rechazados que coinciden con la búsqueda por correo.
export function useExportRejectedUsersCsv(search?: string) {
  const exportReport = useCallback(() => reportsService.exportRejectedUsersCsv({ search }), [search]);

  return useExportReportCsv(exportReport);
}
