import { FileText } from "lucide-react";
import { formatDateTime } from "@/shared/utils/date.utils";
import type { GeneratedReport, ReportType } from "../types/generated-report.types";
import { TableMessageRow, TableSkeletonRows } from "./table-state-rows";

interface ReportHistoryTableProps {
  reports: GeneratedReport[];
  isLoading: boolean;
  errorMessage?: string;
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  REGISTERED_USERS: "Lista de Usuarios",
  GRADUATES: "Egresados",
  REJECTED_USERS: "Rechazados",
};

const COLUMN_COUNT = 3;

export function ReportHistoryTable({ reports, isLoading, errorMessage }: ReportHistoryTableProps) {
  const renderBody = () => {
    if (isLoading) {
      return <TableSkeletonRows columnCount={COLUMN_COUNT} />;
    }

    if (errorMessage) {
      return <TableMessageRow columnCount={COLUMN_COUNT} message={errorMessage} />;
    }

    if (reports.length === 0) {
      return <TableMessageRow columnCount={COLUMN_COUNT} message="Aún no se generaron reportes." />;
    }

    return reports.map((report) => (
      <tr key={report.id} className="border-t border-border transition-colors hover:bg-surface-soft">
        <td className="px-6 py-4">
          <span className="flex items-center gap-3 text-ink-soft">
            <FileText className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.5} aria-hidden="true" />
            <span className="break-all">{report.fileName}</span>
          </span>
        </td>
        <td className="px-6 py-4 text-ink-soft">{REPORT_TYPE_LABELS[report.reportType]}</td>
        <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{formatDateTime(report.generatedAt)}</td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface-soft text-text-secondary">
          <tr>
            <th scope="col" className="px-6 py-3 font-semibold">Nombre del Archivo / Reporte</th>
            <th scope="col" className="px-6 py-3 font-semibold">Tipo de Reporte</th>
            <th scope="col" className="px-6 py-3 font-semibold">Fecha y Hora de Generación</th>
          </tr>
        </thead>
        <tbody aria-busy={isLoading}>{renderBody()}</tbody>
      </table>
    </div>
  );
}
