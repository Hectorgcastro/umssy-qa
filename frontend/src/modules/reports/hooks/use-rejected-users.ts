"use client";

import { useEffect, useState } from "react";
import type { PaginatedData } from "@/shared/types/api-response.types";
import { reportsService } from "../services/reports.service";
import type { RejectedUser } from "../types/rejected-user.types";

export const REJECTED_USERS_PAGE_SIZE = 10;

interface RejectedUsersState {
  page: number;
  result?: PaginatedData<RejectedUser>;
  errorMessage?: string;
}

// Se migrará a useQuery cuando TanStack Query esté instalado en el proyecto.
export function useRejectedUsers(page: number) {
  const [state, setState] = useState<RejectedUsersState | null>(null);

  useEffect(() => {
    let isCancelled = false;

    reportsService
      .getRejectedUsers({ page, limit: REJECTED_USERS_PAGE_SIZE })
      .then((response) => {
        if (!isCancelled) setState({ page, result: response.data });
      })
      .catch(() => {
        if (!isCancelled) {
          setState({ page, errorMessage: "No se pudo cargar el reporte de usuarios rechazados." });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page]);

  const isCurrentPage = state?.page === page;
  const totalItems = state?.result?.totalItems ?? 0;

  return {
    users: isCurrentPage ? (state.result?.items ?? []) : [],
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / REJECTED_USERS_PAGE_SIZE)),
    isLoading: !isCurrentPage,
    errorMessage: isCurrentPage ? state.errorMessage : undefined,
  };
}
