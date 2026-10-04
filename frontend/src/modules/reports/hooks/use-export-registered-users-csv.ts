"use client";

import { useCallback, useState } from "react";
import { downloadFile } from "@/shared/utils/download-file";
import { reportsService } from "../services/reports.service";
import type { ExportScope, UserType } from "../types/registered-user.types";

// Se migrará a useMutation cuando TanStack Query esté instalado en el proyecto.
export function useExportRegisteredUsersCsv(userType?: UserType) {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const exportCsv = useCallback(async (scope: ExportScope = "filtered") => {
    setIsExporting(true);
    setErrorMessage(undefined);

    try {
      const { file, fileName } = await reportsService.exportRegisteredUsersCsv(
        scope === "all" ? {} : { userType },
      );
      downloadFile(file, fileName);
    } catch {
      setErrorMessage("No se pudo exportar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  }, [userType]);

  return { exportCsv, isExporting, errorMessage };
}
