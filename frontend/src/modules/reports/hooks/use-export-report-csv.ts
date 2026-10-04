"use client";

import { useCallback, useState } from "react";
import { downloadFile } from "@/shared/utils/download-file";
import type { ExportedFile } from "../types/registered-user.types";

// Lógica común de los botones "Exportar CSV": cada reporte pasa su propia función de exportación.
// Se migrará a useMutation cuando TanStack Query esté instalado en el proyecto.
export function useExportReportCsv(exportReport: () => Promise<ExportedFile>) {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    setErrorMessage(undefined);

    try {
      const { file, fileName } = await exportReport();
      downloadFile(file, fileName);
    } catch {
      setErrorMessage("No se pudo exportar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  }, [exportReport]);

  return { exportCsv, isExporting, errorMessage };
}
