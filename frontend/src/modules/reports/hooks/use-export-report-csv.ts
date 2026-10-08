"use client";

import { useCallback, useEffect, useState } from "react";
import { downloadFile } from "@/shared/utils/download-file";
import type { ExportedFile } from "../types/registered-user.types";

export const EXPORT_SUCCESS_MESSAGE = "La exportación de la tabla ha sido un éxito";
export const EXPORT_SUCCESS_DURATION_MS = 4000;

// Lógica común de los botones "Exportar CSV": cada reporte pasa su propia función de exportación.
// TODO: migrar a useMutation cuando TanStack Query esté instalado en el proyecto.
export function useExportReportCsv(exportReport: () => Promise<ExportedFile>) {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  // La notificación de éxito se oculta sola, sin recargar la vista.
  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = setTimeout(() => setSuccessMessage(undefined), EXPORT_SUCCESS_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      const { file, fileName } = await exportReport();
      downloadFile(file, fileName);
      setSuccessMessage(EXPORT_SUCCESS_MESSAGE);
    } catch {
      setErrorMessage("No se pudo exportar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  }, [exportReport]);

  return { exportCsv, isExporting, errorMessage, successMessage };
}
