import { ORIENTATION_TYPES } from "../../data/orientation-types";
import { TECHNICAL_AREAS } from "../../data/technical-areas";

interface ConfirmationStepProps {
  wantsToParticipate: boolean;
  selectedTechnicalAreaIds: string[];
  selectedOrientationTypeIds: string[];
  isActivating: boolean;
  onEditTechnicalAreas: () => void;
  onEditOrientationTypes: () => void;
  onActivate: () => void;
}

export function ConfirmationStep({
  wantsToParticipate,
  selectedTechnicalAreaIds,
  selectedOrientationTypeIds,
  isActivating,
  onEditTechnicalAreas,
  onEditOrientationTypes,
  onActivate,
}: ConfirmationStepProps) {
  const selectedTechnicalAreas = TECHNICAL_AREAS.filter((area) =>
    selectedTechnicalAreaIds.includes(area.id),
  );

  const selectedOrientationTypes = ORIENTATION_TYPES.filter((orientation) =>
    selectedOrientationTypeIds.includes(orientation.id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Confirma tu participación
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Revisa tu configuración antes de activar tu participación como mentor.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-ink">
            Participación
          </h3>
        </div>

        <p className="mt-2 text-sm text-text-secondary">
          {wantsToParticipate
            ? "Participar como mentor"
            : "No participar como mentor"}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-ink">
            Áreas técnicas
          </h3>

          <button
            type="button"
            onClick={onEditTechnicalAreas}
            className="text-sm font-semibold text-accent"
          >
            Editar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTechnicalAreas.map((area) => (
            <span
              key={area.id}
              className="rounded-full border border-border px-3 py-1 text-sm text-ink"
            >
              {area.name}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-ink">
            Tipos de orientación
          </h3>

          <button
            type="button"
            onClick={onEditOrientationTypes}
            className="text-sm font-semibold text-accent"
          >
            Editar
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {selectedOrientationTypes.map((orientation) => (
            <span
              key={orientation.id}
              className="rounded-full border border-border px-3 py-1 text-sm text-ink"
            >
              {orientation.label}
            </span>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onActivate}
        disabled={isActivating}
        className="w-full rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isActivating ? "Activando..." : "Activar participación"}
      </button>
    </div>
  );
}
