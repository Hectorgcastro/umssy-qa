"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApiResponse, PaginatedData } from "@/shared/types/api-response.types";

// Los reportes se piden al backend en lotes de máximo 10 registros.
export const REPORT_PAGE_SIZE = 10;

export type FetchReportPage<T> = (page: number, limit: number) => Promise<ApiResponse<PaginatedData<T>>>;

interface ReportPageState<T> {
  fetchPage: FetchReportPage<T>;
  page: number;
  refreshCount: number;
  result?: PaginatedData<T>;
  errorMessage?: string;
}

// Carga paginada común a las tablas de reportes. `fetchPage` debe venir de useCallback:
// cuando cambian sus filtros cambia la función y se vuelve a consultar la página.
// TODO: migrar a useQuery cuando TanStack Query esté instalado en el proyecto.
export function usePaginatedReport<T>(fetchPage: FetchReportPage<T>, page: number, loadErrorMessage: string) {
  const [state, setState] = useState<ReportPageState<T> | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const request = { fetchPage, page, refreshCount };

    fetchPage(page, REPORT_PAGE_SIZE)
      .then((response) => {
        if (!isCancelled) setState({ ...request, result: response.data });
      })
      .catch(() => {
        if (!isCancelled) setState({ ...request, errorMessage: loadErrorMessage });
      });

    return () => {
      isCancelled = true;
    };
  }, [fetchPage, page, refreshCount, loadErrorMessage]);

  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);

  // Solo se muestran los datos de la consulta vigente: mientras llega la nueva página
  // o el nuevo filtro, la tabla queda en estado de carga.
  const isCurrentRequest =
    state !== null && state.fetchPage === fetchPage && state.page === page && state.refreshCount === refreshCount;
  const totalItems = state?.result?.totalItems ?? 0;

  return {
    items: isCurrentRequest ? (state.result?.items ?? []) : [],
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / REPORT_PAGE_SIZE)),
    isLoading: !isCurrentRequest,
    errorMessage: isCurrentRequest ? state.errorMessage : undefined,
    refresh,
  };
}
