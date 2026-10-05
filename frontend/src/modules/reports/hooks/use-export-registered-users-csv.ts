"use client";

import { useCallback } from "react";
import { reportsService } from "../services/reports.service";
import type { UserType } from "../types/registered-user.types";
import { useExportReportCsv } from "./use-export-report-csv";

export function useExportRegisteredUsersCsv(userType?: UserType, period?: string) {
  const exportReport = useCallback(
    () => reportsService.exportRegisteredUsersCsv({ userType, period }),
    [userType, period],
  );

  return useExportReportCsv(exportReport);
}
