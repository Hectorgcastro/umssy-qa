import { FileText, RotateCw } from "lucide-react";

const ACTION_BUTTON_CLASS =
  "flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-sm text-white shadow-sm transition-colors hover:bg-ink-soft";

// Botones sin acción hasta conectar los reportes con el backend.
export function ReportActionButtons() {
  return (
    <>
      <button type="button" className={ACTION_BUTTON_CLASS}>
        <RotateCw aria-hidden="true" className="h-4 w-4" />
        Actualizar
      </button>
      <button
        type="button"
        className={`${ACTION_BUTTON_CLASS} border-l-4 border-accent`}
      >
        <FileText aria-hidden="true" className="h-4 w-4" />
        Exportar CSV
      </button>
    </>
  );
}
