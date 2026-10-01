import { apiClient } from "@/shared/services/api-client";
import type {
  ApiResponse,
  PaginatedResult,
} from "@/shared/types/api-response.types";
import type {
  BaseReportFilters,
  RegisteredUsersFilters,
  RejectedUsersFilters,
  ReportUser,
} from "../types/report-user.types";

// Quita la búsqueda vacía para no enviar parámetros innecesarios.
function buildParams<TFilters extends BaseReportFilters>(filters: TFilters) {
  const { search, ...rest } = filters;
  const trimmedSearch = search.trim();
  return trimmedSearch ? { ...rest, search: trimmedSearch } : rest;
}

async function getReportUsers<TFilters extends BaseReportFilters>(
  path: string,
  filters: TFilters,
): Promise<PaginatedResult<ReportUser>> {
  const response = await apiClient.get<
    ApiResponse<PaginatedResult<ReportUser>>
  >(path, { params: buildParams(filters) });
  return response.data.data;
}

export const reportsService = {
  getRegisteredUsers: (filters: RegisteredUsersFilters) =>
    getReportUsers("/reports/registered-users", filters),
  getRejectedUsers: (filters: RejectedUsersFilters) =>
    getReportUsers("/reports/rejected-users", filters),
};
