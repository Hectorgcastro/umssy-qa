import { FileText, RotateCw } from "lucide-react";
import { SelectField } from "@/shared/components/ui/select-field";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";
import { buildManagementYearOptions } from "../utils/management-years";

const TOOLBAR_BUTTON_CLASS =
  "flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-sm text-white shadow-sm transition-colors hover:bg-ink-soft";

// Botones y filtros sin acción hasta conectar el reporte con el backend.
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
        <button type="button" className={TOOLBAR_BUTTON_CLASS}>
          <RotateCw aria-hidden="true" className="h-4 w-4" />
          Actualizar
        </button>
        <button
          type="button"
          className={`${TOOLBAR_BUTTON_CLASS} border-l-4 border-accent`}
        >
          <FileText aria-hidden="true" className="h-4 w-4" />
          Exportar CSV
        </button>
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
