import { ExportCsvButton } from "./export-csv-button";
import { ManagementMenu } from "./management-menu";

interface ReportActionsProps {
  onExport?: () => void;
  isExporting?: boolean;
}

export function ReportActions({ onExport, isExporting }: ReportActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportCsvButton onClick={onExport} isExporting={isExporting} />
      <ManagementMenu />
    </div>
  );
}
