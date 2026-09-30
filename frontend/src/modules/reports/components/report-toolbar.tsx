import { SelectField } from "@/shared/components/ui/select-field";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";
import { buildManagementYearOptions } from "../utils/management-years";
import { ReportActionButtons } from "./report-action-buttons";

// Filtros sin acción hasta conectar el reporte con el backend.
export function ReportToolbar() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SelectField
        label="Tipo de usuario"
        options={USER_TYPE_OPTIONS}
        defaultValue="all"
      />

      <div className="flex flex-wrap items-center gap-4">
        <ReportActionButtons />
        <div className="w-36">
          <SelectField
            label="Gestión"
            options={buildManagementYearOptions(currentYear)}
            defaultValue={String(currentYear)}
          />
        </div>
      </div>
    </div>
  );
}
