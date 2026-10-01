"use client";

import { PageHeader } from "@/shared/components/layout/page-header";
import { Pagination } from "@/shared/components/ui/pagination";
import { SearchInput } from "@/shared/components/ui/search-input";
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback";
import { ReportActionButtons } from "../components/report-action-buttons";
import { ReportTable } from "../components/report-table";
import { REJECTED_USER_COLUMNS } from "../components/report-user-columns";
import {
  REPORT_PAGE_SIZE,
  SEARCH_DEBOUNCE_MS,
} from "../constants/report-pagination";
import { REJECTED_USERS_BREADCRUMB } from "../constants/rejected-users-report";
import { useReportUsers } from "../hooks/use-report-users";
import { reportsService } from "../services/reports.service";

export function RejectedUsersReportView() {
  const { result, isLoading, hasError, updateFilters, changePage, reload } =
    useReportUsers(reportsService.getRejectedUsers, {
      page: 1,
      limit: REPORT_PAGE_SIZE,
      search: "",
    });
  const searchUsers = useDebouncedCallback(
    (search: string) => updateFilters({ search }),
    SEARCH_DEBOUNCE_MS,
  );

  return (
    <div className="space-y-5 p-8">
      <PageHeader
        title="Reporte de usuarios rechazados"
        breadcrumbItems={REJECTED_USERS_BREADCRUMB}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput
          label="Buscar usuarios rechazados"
          placeholder="Buscar por nombre, correo o identificador"
          onChange={searchUsers}
        />
        <div className="flex flex-wrap items-center gap-4">
          <ReportActionButtons onRefresh={reload} isRefreshing={isLoading} />
        </div>
      </div>

      <ReportTable
        columns={REJECTED_USER_COLUMNS}
        rows={result?.items ?? []}
        getRowKey={(user) => user.id}
        isLoading={isLoading}
        hasError={hasError}
        emptyMessage="No hay usuarios rechazados para mostrar."
      />
      {result && !hasError && result.total > 0 && (
        <Pagination
          page={result.page}
          limit={result.limit}
          total={result.total}
          itemLabel="usuarios"
          onPageChange={changePage}
        />
      )}
    </div>
  );
}
