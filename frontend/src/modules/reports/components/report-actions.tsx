import type { ExportScope } from "../types/registered-user.types";
import { ExportCsvButton } from "./export-csv-button";
import { ManagementMenu } from "./management-menu";

interface ReportActionsProps {
  onExport?: (scope: ExportScope) => void;
  isExporting?: boolean;
  hasActiveFilters?: boolean;
}

export function ReportActions({ onExport, isExporting, hasActiveFilters }: ReportActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportCsvButton onExport={onExport} isExporting={isExporting} hasActiveFilters={hasActiveFilters} />
      <ManagementMenu />
    </div>
  );
}
