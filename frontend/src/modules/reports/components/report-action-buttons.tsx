import { FileText, RotateCw } from "lucide-react";

interface ReportActionButtonsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ACTION_BUTTON_CLASS =
  "flex h-11 items-center gap-2 rounded-md bg-ink px-5 text-sm text-white shadow-sm transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-80";

// Exportar CSV queda sin acción hasta la H.U. de exportación.
export function ReportActionButtons({
  onRefresh,
  isRefreshing,
}: ReportActionButtonsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className={ACTION_BUTTON_CLASS}
      >
        <RotateCw
          aria-hidden="true"
          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
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
