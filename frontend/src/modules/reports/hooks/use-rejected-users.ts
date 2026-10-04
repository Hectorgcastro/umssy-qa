"use client";

import { useCallback } from "react";
import { reportsService } from "../services/reports.service";
import { usePaginatedReport } from "./use-paginated-report";

const LOAD_ERROR_MESSAGE = "No se pudo cargar el reporte de usuarios rechazados.";

export function useRejectedUsers(page: number, search = "") {
  const fetchPage = useCallback(
    (requestedPage: number, limit: number) => reportsService.getRejectedUsers({ page: requestedPage, limit, search }),
    [search],
  );
  const { items, ...report } = usePaginatedReport(fetchPage, page, LOAD_ERROR_MESSAGE);

  return { users: items, ...report };
}
