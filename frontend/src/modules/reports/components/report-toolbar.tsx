import { ChevronDown, FileText, RotateCw, Settings } from "lucide-react";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";

const TOOLBAR_BUTTON_CLASS =
  "flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-sm text-white shadow-sm transition-colors hover:bg-ink-soft";

// Botones sin acción hasta conectar el reporte con el backend.
export function ReportToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <label className="flex w-full max-w-xs flex-col rounded-md border border-border bg-surface px-3 py-1.5 shadow-sm">
        <span className="text-[10px] text-text-secondary">Tipo de usuario</span>
        <select
          defaultValue="all"
          className="bg-transparent text-sm text-ink outline-none"
        >
          {USER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

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
        <button type="button" className={TOOLBAR_BUTTON_CLASS}>
          <Settings aria-hidden="true" className="h-4 w-4" />
          Gestión
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
