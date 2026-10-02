import type { MentorGuidanceType } from "../types/mentor-profile.types";

interface MentorGuidanceTypesProps {
  guidanceTypes: MentorGuidanceType[];
}

export function MentorGuidanceTypes({
  guidanceTypes,
}: MentorGuidanceTypesProps) {
  if (guidanceTypes.length === 0) {
    return (
      <section className="rounded-xl border border-umssy-border bg-white p-6">
        <h2 className="text-xl font-bold text-umssy-ink">
          Tipos de orientación
        </h2>

        <p className="mt-4 text-sm text-umssy-secondary">
          Este mentor todavía no registró tipos de orientación.
        </p>
      </section>
    );
  }

  const firstGuidance = guidanceTypes[0];

  return (
    <section className="rounded-xl border border-umssy-border bg-white p-6">
      <h2 className="text-xl font-bold text-umssy-ink">Tipos de orientación</h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {guidanceTypes.map((guidance, index) => (
          <span
            key={guidance.id}
            className={
              index === 0
                ? "rounded-lg border border-umssy-gold bg-umssy-background px-4 py-2 text-sm font-semibold text-umssy-ink"
                : "rounded-lg border border-umssy-border bg-white px-4 py-2 text-sm font-medium text-umssy-secondary"
            }
          >
            {guidance.name}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-umssy-background p-4">
        <p className="text-sm leading-6 text-umssy-secondary">
          {firstGuidance.description}
        </p>
      </div>
    </section>
  );
}
