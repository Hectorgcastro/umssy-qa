"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { MentorGuidanceType } from "../../types/mentor-guidance-type.types";

type MentorGuidanceTypesProps = {
  guidanceTypes: MentorGuidanceType[];
};

export function MentorGuidanceTypes({
  guidanceTypes,
}: MentorGuidanceTypesProps) {
  const [selectedGuidanceId, setSelectedGuidanceId] = useState(
    guidanceTypes[0]?.id,
  );

  if (guidanceTypes.length === 0) {
    return (
      <Card className="gap-0 overflow-visible rounded-xl border border-umssy-border bg-white py-0 text-base ring-0">
        <CardHeader className="px-6 pt-6">
          <CardTitle
            role="heading"
            aria-level={2}
            className="text-xl font-bold text-umssy-ink"
          >
            Tipos de orientación
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-4">
          <p className="text-umssy-secondary">
            Este mentor todavía no registró tipos de orientación.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedGuidance =
    guidanceTypes.find((guidance) => guidance.id === selectedGuidanceId) ??
    guidanceTypes[0];

  return (
    <Card className="gap-0 overflow-visible rounded-xl border border-umssy-border bg-white py-0 text-base ring-0">
      <CardHeader className="px-6 pt-6">
        <CardTitle
          role="heading"
          aria-level={2}
          className="text-xl font-bold text-umssy-ink"
        >
          Tipos de orientación
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-4">
        <div className="flex flex-wrap gap-2">
          {guidanceTypes.map((guidance) => {
            const isSelected = guidance.id === selectedGuidance.id;

            return (
              <button
                key={guidance.id}
                type="button"
                onClick={() => setSelectedGuidanceId(guidance.id)}
                aria-pressed={isSelected}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umssy-red ${
                  isSelected
                    ? "border-umssy-red bg-umssy-red-soft text-umssy-ink shadow-md"
                    : "border-umssy-border bg-white text-umssy-secondary hover:-translate-y-0.5 hover:border-umssy-red hover:bg-umssy-background hover:shadow-md"
                }`}
              >
                {guidance.name}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg bg-umssy-background p-4">
          <p className="text-sm leading-6 text-umssy-ink">
            {selectedGuidance.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
