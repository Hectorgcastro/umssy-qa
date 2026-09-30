import { PageHeader } from "@/shared/components/layout/page-header";
import { SearchInput } from "@/shared/components/ui/search-input";
import { ReportActionButtons } from "../components/report-action-buttons";
import { ReportTable } from "../components/report-table";
import {
  REJECTED_USERS_BREADCRUMB,
  REJECTED_USERS_COLUMNS,
} from "../constants/rejected-users-report";

export function RejectedUsersReportView() {
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
        />
        <div className="flex flex-wrap items-center gap-4">
          <ReportActionButtons />
        </div>
      </div>

      <ReportTable
        columns={REJECTED_USERS_COLUMNS}
        emptyMessage="No hay usuarios rechazados para mostrar."
      />
    </div>
  );
}
