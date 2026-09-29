import { PageHeader } from "@/shared/components/layout/page-header";
import { RegisteredUsersTable } from "../components/registered-users-table";
import { ReportToolbar } from "../components/report-toolbar";
import { REGISTERED_USERS_BREADCRUMB } from "../constants/registered-users-report";

export function RegisteredUsersReportView() {
  return (
    <div className="space-y-5 p-8">
      <PageHeader
        title="Reporte de usuarios registrados"
        breadcrumbItems={REGISTERED_USERS_BREADCRUMB}
      />
      <ReportToolbar />
      <RegisteredUsersTable />
    </div>
  );
}
