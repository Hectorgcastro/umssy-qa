"use client";

import { useCallback, useState } from "react";
import { downloadFile } from "@/shared/utils/download-file";
import { reportsService } from "../services/reports.service";

// Se migrará a useMutation cuando TanStack Query esté instalado en el proyecto.
export function useExportRejectedUsersCsv(search = "") {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    setErrorMessage(undefined);

    try {
      const { file, fileName } = await reportsService.exportRejectedUsersCsv({ search });
      downloadFile(file, fileName);
    } catch {
      setErrorMessage("No se pudo exportar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  }, [search]);

  return { exportCsv, isExporting, errorMessage };
}
