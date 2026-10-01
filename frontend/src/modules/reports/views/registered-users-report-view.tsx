"use client";

import { PageHeader } from "@/shared/components/layout/page-header";
import { Pagination } from "@/shared/components/ui/pagination";
import { ReportTable } from "../components/report-table";
import { ReportToolbar } from "../components/report-toolbar";
import { REGISTERED_USER_COLUMNS } from "../components/report-user-columns";
import { REPORT_PAGE_SIZE } from "../constants/report-pagination";
import { REGISTERED_USERS_BREADCRUMB } from "../constants/registered-users-report";
import { useReportUsers } from "../hooks/use-report-users";
import { reportsService } from "../services/reports.service";

export function RegisteredUsersReportView() {
  const currentYear = new Date().getFullYear();
  const { result, isLoading, hasError, updateFilters, changePage, reload } =
    useReportUsers(reportsService.getRegisteredUsers, {
      page: 1,
      limit: REPORT_PAGE_SIZE,
      userType: "all",
      year: currentYear,
      search: "",
    });

  return (
    <div className="space-y-5 p-8">
      <PageHeader
        title="Reporte de usuarios registrados"
        breadcrumbItems={REGISTERED_USERS_BREADCRUMB}
      />
      <ReportToolbar
        currentYear={currentYear}
        isRefreshing={isLoading}
        onUserTypeChange={(userType) => updateFilters({ userType })}
        onYearChange={(year) => updateFilters({ year })}
        onRefresh={reload}
      />
      <ReportTable
        columns={REGISTERED_USER_COLUMNS}
        rows={result?.items ?? []}
        getRowKey={(user) => user.id}
        isLoading={isLoading}
        hasError={hasError}
        emptyMessage="No hay usuarios registrados para mostrar."
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
