"use client";

import { useMemo } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAcademicPeriods } from "../utils/academic-periods";

interface ManagementMenuProps {
  value?: string;
  onChange?: (period?: string) => void;
}

const ALL_PERIODS_VALUE = "ALL";

// Filtro por gestión académica: "1-2025" (enero a junio) o "2-2025" (julio a diciembre).
export function ManagementMenu({ value, onChange }: ManagementMenuProps) {
  const periods = useMemo(() => getAcademicPeriods(), []);

  const handleValueChange = (selectedValue: string) => {
    onChange?.(selectedValue === ALL_PERIODS_VALUE ? undefined : selectedValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            className="group h-auto gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-surface hover:bg-ink-soft aria-expanded:bg-ink-soft aria-expanded:text-surface"
          />
        }
      >
        <Settings className="size-5" strokeWidth={1.5} aria-hidden="true" />
        {value ? `Gestión ${value}` : "Gestión"}
        <ChevronDown className="size-4 transition-transform group-aria-expanded:rotate-180" aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="max-h-72 w-40 overflow-y-auto rounded-md bg-surface py-1 text-ink-soft ring-border"
      >
        <DropdownMenuRadioGroup value={value ?? ALL_PERIODS_VALUE} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem
              closeOnClick
            value={ALL_PERIODS_VALUE}
            className="rounded-none px-4 py-2 text-sm text-ink-soft focus:bg-surface-soft focus:text-ink"
          >
            Todas
          </DropdownMenuRadioItem>
          {periods.map((period) => (
            <DropdownMenuRadioItem
              closeOnClick
              key={period}
              value={period}
              className="rounded-none px-4 py-2 text-sm text-ink-soft focus:bg-surface-soft focus:text-ink"
            >
              {period}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
