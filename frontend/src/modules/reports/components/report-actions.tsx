import { ExportCsvButton } from "./export-csv-button";
import { ManagementMenu } from "./management-menu";

export function ReportActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportCsvButton />
      <ManagementMenu />
    </div>
  );
}
