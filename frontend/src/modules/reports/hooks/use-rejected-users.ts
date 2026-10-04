"use client";

import { useCallback, useEffect, useState } from "react";
import type { PaginatedData } from "@/shared/types/api-response.types";
import { reportsService } from "../services/reports.service";
import type { RejectedUser } from "../types/rejected-user.types";

export const REJECTED_USERS_PAGE_SIZE = 10;

interface RejectedUsersState {
  requestKey: string;
  result?: PaginatedData<RejectedUser>;
  errorMessage?: string;
}

// Se migrará a useQuery cuando TanStack Query esté instalado en el proyecto.
export function useRejectedUsers(page: number, search = "") {
  const [state, setState] = useState<RejectedUsersState | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const requestKey = `${page}-${search}-${refreshCount}`;

  useEffect(() => {
    let isCancelled = false;

    reportsService
      .getRejectedUsers({ page, limit: REJECTED_USERS_PAGE_SIZE, search })
      .then((response) => {
        if (!isCancelled) setState({ requestKey, result: response.data });
      })
      .catch(() => {
        if (!isCancelled) {
          setState({ requestKey, errorMessage: "No se pudo cargar el reporte de usuarios rechazados." });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page, search, requestKey]);

  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);

  const isCurrentRequest = state?.requestKey === requestKey;
  const totalItems = state?.result?.totalItems ?? 0;

  return {
    users: isCurrentRequest ? (state.result?.items ?? []) : [],
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / REJECTED_USERS_PAGE_SIZE)),
    isLoading: !isCurrentRequest,
    errorMessage: isCurrentRequest ? state.errorMessage : undefined,
    refresh,
  };
}
