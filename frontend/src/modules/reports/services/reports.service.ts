import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse, PaginatedData } from "@/shared/types/api-response.types";
import type { GeneratedReport, ReportHistoryParams } from "../types/generated-report.types";
import type { RegisteredUser, RegisteredUsersParams } from "../types/registered-user.types";
import type { RejectedUser, RejectedUsersParams } from "../types/rejected-user.types";
import { REGISTERED_USERS_MOCK } from "./registered-users.mock";
import { REPORT_HISTORY_MOCK } from "./report-history.mock";

export const reportsService = {
  // Mock temporal: reemplazar por apiClient.get("/reports/history", { params }) cuando exista el endpoint.
  getReportHistory: async ({
    page,
    limit,
  }: ReportHistoryParams): Promise<ApiResponse<PaginatedData<GeneratedReport>>> => {
    const offset = (page - 1) * limit;

    return {
      statusCode: 200,
      data: {
        items: REPORT_HISTORY_MOCK.slice(offset, offset + limit),
        totalItems: REPORT_HISTORY_MOCK.length,
      },
      offset,
      page,
      detail: "Historial de reportes obtenido correctamente",
      ok: true,
    };
  },

  // Mock temporal: reemplazar por apiClient.get("/reports/registered-users", { params }) cuando exista el endpoint.
  getRegisteredUsers: async ({
    page,
    limit,
    userType,
  }: RegisteredUsersParams): Promise<ApiResponse<PaginatedData<RegisteredUser>>> => {
    const offset = (page - 1) * limit;
    const filteredUsers = userType
      ? REGISTERED_USERS_MOCK.filter((user) => user.userType === userType)
      : REGISTERED_USERS_MOCK;

    return {
      statusCode: 200,
      data: {
        items: filteredUsers.slice(offset, offset + limit),
        totalItems: filteredUsers.length,
      },
      offset,
      page,
      detail: "Usuarios registrados obtenidos correctamente",
      ok: true,
    };
  },

  getRejectedUsers: async ({
    page,
    limit,
    search,
  }: RejectedUsersParams): Promise<ApiResponse<PaginatedData<RejectedUser>>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<RejectedUser>>>("/reports/rejected-users", {
      params: { page, limit, search: search || undefined },
    });

    return data;
  },
};
