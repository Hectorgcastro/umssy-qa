import { ChevronDown, FileText, RotateCw, Settings } from "lucide-react";
import { USER_TYPE_OPTIONS } from "../constants/registered-users-report";

const TOOLBAR_BUTTON_CLASS =
  "flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-sm text-white shadow-sm transition-colors hover:bg-ink-soft";

// Botones sin acción hasta conectar el reporte con el backend.
export function ReportToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <label className="group relative flex w-full max-w-xs cursor-pointer flex-col rounded-md border border-border-strong bg-surface shadow-sm transition-colors hover:border-ink-soft hover:bg-surface-soft focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <span className="pointer-events-none absolute left-3 top-1.5 text-[10px] font-semibold text-text-secondary group-focus-within:text-accent">
          Tipo de usuario
        </span>
        <select
          defaultValue="all"
          className="w-full cursor-pointer appearance-none bg-transparent pb-1.5 pl-3 pr-10 pt-5 text-sm font-semibold text-ink outline-none"
        >
          {USER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft transition-transform group-focus-within:rotate-180 group-focus-within:text-accent"
        />
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
