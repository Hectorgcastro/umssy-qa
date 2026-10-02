import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sin acción todavía: la exportación se conectará cuando el backend la exponga.
export function ExportCsvButton() {
  return (
    <Button
      type="button"
      className="relative h-auto gap-2 overflow-hidden rounded-md bg-ink py-2.5 pl-5 pr-4 text-sm font-semibold text-surface before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-accent hover:bg-ink-soft"
    >
      <FileText className="size-5" strokeWidth={1.5} aria-hidden="true" />
      Exportar CSV
    </Button>
  );
}
