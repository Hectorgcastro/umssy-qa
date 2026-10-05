import type { AcademicPeriod } from "../types/registered-user.types";
import { ExportCsvButton } from "./export-csv-button";
import { ManagementMenu } from "./management-menu";

interface ReportActionsProps {
  onExport?: () => void;
  isExporting?: boolean;
  period?: AcademicPeriod;
  onPeriodChange?: (period?: AcademicPeriod) => void;
}

export function ReportActions({ onExport, isExporting, period, onPeriodChange }: ReportActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportCsvButton onClick={onExport} isExporting={isExporting} />
      <ManagementMenu value={period} onChange={onPeriodChange} />
    </div>
  );
}
