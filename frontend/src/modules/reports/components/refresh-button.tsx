import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  label?: string;
  onClick?: () => void;
  isRefreshing?: boolean;
}

export function RefreshButton({ label = "actualizar", onClick, isRefreshing = false }: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRefreshing}
      className="flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-base font-semibold text-surface transition-colors hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-70"
    >
      <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} strokeWidth={1.5} aria-hidden="true" />
      {label}
    </button>
  );
}
