"use client";

import { useCallback } from "react";
import { reportsService } from "../services/reports.service";
import type { UserType } from "../types/registered-user.types";
import { usePaginatedReport } from "./use-paginated-report";

const LOAD_ERROR_MESSAGE = "No se pudo cargar el reporte de usuarios registrados.";

export function useRegisteredUsers(page: number, userType?: UserType, period?: string) {
  const fetchPage = useCallback(
    (requestedPage: number, limit: number) =>
      reportsService.getRegisteredUsers({ page: requestedPage, limit, userType, period }),
    [userType, period],
  );
  const { items, ...report } = usePaginatedReport(fetchPage, page, LOAD_ERROR_MESSAGE);

  return { users: items, ...report };
}
