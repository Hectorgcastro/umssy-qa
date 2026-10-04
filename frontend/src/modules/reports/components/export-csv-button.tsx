"use client";

import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExportScope } from "../types/registered-user.types";

interface ExportCsvButtonProps {
  onExport?: (scope: ExportScope) => void;
  isExporting?: boolean;
  hasActiveFilters?: boolean;
}

const MENU_ITEM_CLASS_NAME = "rounded-none px-4 py-2 text-sm text-ink-soft focus:bg-surface-soft focus:text-ink";

// Abre un menú para elegir si se exporta todo el reporte o solo lo que coincide con los filtros actuales.
export function ExportCsvButton({ onExport, isExporting = false, hasActiveFilters = false }: ExportCsvButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isExporting}
        aria-busy={isExporting}
        render={
          <Button
            type="button"
            className="group relative h-auto gap-2 overflow-hidden rounded-md bg-ink py-2.5 pl-5 pr-4 text-sm font-semibold text-surface before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-accent hover:bg-ink-soft aria-expanded:bg-ink-soft aria-expanded:text-surface"
          />
        }
      >
        <FileText className="size-5" strokeWidth={1.5} aria-hidden="true" />
        {isExporting ? "Exportando..." : "Exportar CSV"}
        <ChevronDown className="size-4 transition-transform group-aria-expanded:rotate-180" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-md bg-surface py-1 text-ink-soft ring-border">
        <DropdownMenuItem className={MENU_ITEM_CLASS_NAME} onClick={() => onExport?.("all")}>
          Exportar todo
        </DropdownMenuItem>
        <DropdownMenuItem
          className={MENU_ITEM_CLASS_NAME}
          disabled={!hasActiveFilters}
          onClick={() => onExport?.("filtered")}
        >
          Exportar según filtros
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
