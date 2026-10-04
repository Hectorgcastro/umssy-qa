"use client";

import { CheckCircle, Server } from "lucide-react";
import { TECHNICAL_AREA_ICON_MAP } from "../../constants/technical-area-icon-map.constants";
import type { TechnicalArea } from "../../types/technical-area.types";

interface TechnicalAreaCardProps {
  area: TechnicalArea;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function TechnicalAreaCard({
  area,
  isSelected,
  onToggle,
}: TechnicalAreaCardProps) {
  const Icon = TECHNICAL_AREA_ICON_MAP[area.icon] ?? Server;

  return (
    <button
      type="button"
      onClick={() => onToggle(area.id)}
      className={[
        "flex w-full flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors",
        isSelected
          ? "border-red-600 bg-red-50"
          : "border-border bg-slate-100 hover:border-slate-300",
      ].join(" ")}
      aria-pressed={isSelected}
    >
      <div className="flex w-full items-start justify-between">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-md",
            isSelected ? "bg-red-600 text-white" : "bg-white text-slate-600",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>

        <div
          className={[
            "flex h-5 w-5 items-center justify-center rounded border",
            isSelected
              ? "border-red-600 bg-red-600 text-white"
              : "border-slate-300 bg-white",
          ].join(" ")}
        >
          {isSelected && (
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">{area.name}</h3>
        <p className="mt-1 text-xs text-text-secondary">{area.description}</p>
      </div>
    </button>
  );
}
