import { FileText } from "lucide-react";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";
import type { ReportUser } from "../types/report-user.types";
import { formatReportDate } from "../utils/format-report-date";
import type { ReportTableColumn } from "./report-table";

const MISSING_VALUE = "-";

function getUserTypeLabel(userType: string): string {
  return (
    USER_TYPE_OPTIONS.find((option) => option.value === userType)?.label ??
    userType
  );
}

function DocumentCell({ document }: { document: string | null }) {
  if (!document) {
    return <span className="text-text-secondary">{MISSING_VALUE}</span>;
  }

  return (
    <span className="flex items-center gap-2">
      <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft" />
      {document}
    </span>
  );
}

const USER_COLUMN: ReportTableColumn<ReportUser> = {
  header: "Usuario",
  render: (user) => <span className="font-semibold">{user.fullName}</span>,
};

const EMAIL_COLUMN: ReportTableColumn<ReportUser> = {
  header: "Correo",
  render: (user) => user.email,
  isNoWrap: true,
};

const IDENTIFIER_COLUMN: ReportTableColumn<ReportUser> = {
  header: "Identificador",
  render: (user) => user.identifier ?? MISSING_VALUE,
  isNoWrap: true,
};

const DOCUMENT_COLUMN: ReportTableColumn<ReportUser> = {
  header: "Documento",
  render: (user) => <DocumentCell document={user.document} />,
};

const REGISTERED_AT_COLUMN: ReportTableColumn<ReportUser> = {
  header: "Fecha de Registro",
  render: (user) => formatReportDate(user.registeredAt),
  isNoWrap: true,
};

export const REGISTERED_USER_COLUMNS: ReportTableColumn<ReportUser>[] = [
  USER_COLUMN,
  EMAIL_COLUMN,
  {
    header: "Tipo de Usuario",
    render: (user) => getUserTypeLabel(user.userType),
  },
  IDENTIFIER_COLUMN,
  DOCUMENT_COLUMN,
  REGISTERED_AT_COLUMN,
];

export const REJECTED_USER_COLUMNS: ReportTableColumn<ReportUser>[] = [
  USER_COLUMN,
  EMAIL_COLUMN,
  IDENTIFIER_COLUMN,
  DOCUMENT_COLUMN,
  REGISTERED_AT_COLUMN,
];
