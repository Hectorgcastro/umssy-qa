import { PageHeader } from "@/shared/components/layout/page-header";
import { ReportTable } from "../components/report-table";
import { ReportToolbar } from "../components/report-toolbar";
import {
  REGISTERED_USERS_BREADCRUMB,
  REGISTERED_USERS_COLUMNS,
} from "../constants/registered-users-report";

export function RegisteredUsersReportView() {
  return (
    <div className="space-y-5 p-8">
      <PageHeader
        title="Reporte de usuarios registrados"
        breadcrumbItems={REGISTERED_USERS_BREADCRUMB}
      />
      <ReportToolbar />
      <ReportTable
        columns={REGISTERED_USERS_COLUMNS}
        emptyMessage="No hay usuarios registrados para mostrar."
      />
    </div>
  );
}
