import { SelectField } from "@/shared/components/ui/select-field";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";
import { buildManagementYearOptions } from "../utils/management-years";
import { ReportActionButtons } from "./report-action-buttons";

interface ReportToolbarProps {
  currentYear: number;
  isRefreshing: boolean;
  onUserTypeChange: (userType: string) => void;
  onYearChange: (year: number) => void;
  onRefresh: () => void;
}

export function ReportToolbar({
  currentYear,
  isRefreshing,
  onUserTypeChange,
  onYearChange,
  onRefresh,
}: ReportToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SelectField
        label="Tipo de usuario"
        options={USER_TYPE_OPTIONS}
        defaultValue="all"
        onChange={onUserTypeChange}
      />

      <div className="flex flex-wrap items-center gap-4">
        <ReportActionButtons onRefresh={onRefresh} isRefreshing={isRefreshing} />
        <div className="w-36">
          <SelectField
            label="Gestión"
            options={buildManagementYearOptions(currentYear)}
            defaultValue={String(currentYear)}
            onChange={(year) => onYearChange(Number(year))}
          />
        </div>
      </div>
    </div>
  );
}
