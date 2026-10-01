import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  label?: string;
}

// Sin acción todavía: se conectará cuando el backend exponga el endpoint.
export function RefreshButton({ label = "actualizar" }: RefreshButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-base font-semibold text-surface transition-colors hover:bg-ink-soft"
    >
      <RefreshCw className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      {label}
    </button>
  );
}
