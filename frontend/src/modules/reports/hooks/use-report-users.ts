"use client";

import { useEffect, useState } from "react";
import type { PaginatedResult } from "@/shared/types/api-response.types";
import type {
  BaseReportFilters,
  ReportUser,
} from "../types/report-user.types";

type FetchReportUsers<TFilters> = (
  filters: TFilters,
) => Promise<PaginatedResult<ReportUser>>;

// Carga un reporte paginado y vuelve a pedirlo cuando cambian los filtros.
export function useReportUsers<TFilters extends BaseReportFilters>(
  fetchReportUsers: FetchReportUsers<TFilters>,
  initialFilters: TFilters,
) {
  const [filters, setFilters] = useState(initialFilters);
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<PaginatedResult<ReportUser> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;

    fetchReportUsers(filters)
      .then((data) => {
        if (isCurrentRequest) {
          setResult(data);
          setHasError(false);
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [fetchReportUsers, filters, reloadCount]);

  function updateFilters(changes: Partial<TFilters>) {
    setIsLoading(true);
    setFilters((current) => ({ ...current, page: 1, ...changes }));
  }

  function changePage(page: number) {
    setIsLoading(true);
    setFilters((current) => ({ ...current, page }));
  }

  function reload() {
    setIsLoading(true);
    setReloadCount((current) => current + 1);
  }

  return {
    filters,
    result,
    isLoading,
    hasError,
    updateFilters,
    changePage,
    reload,
  };
}
