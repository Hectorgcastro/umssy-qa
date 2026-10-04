import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

      <Card className="gap-0 overflow-visible rounded-lg border border-border bg-surface py-0 ring-0">
        <CardHeader className="px-4 pt-4">
          <CardTitle
            role="heading"
            aria-level={3}
            className="text-sm font-semibold text-ink"
          >
            Participación
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-2">
          <p className="text-sm text-text-secondary">
            {wantsToParticipate
              ? "Participar como mentor"
              : "No participar como mentor"}
          </p>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-visible rounded-lg border border-border bg-surface py-0 ring-0">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle
              role="heading"
              aria-level={3}
              className="text-sm font-semibold text-ink"
            >
              Áreas técnicas
            </CardTitle>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEditTechnicalAreas}
              className="h-auto p-0 text-sm font-semibold text-accent hover:bg-transparent hover:text-accent active:translate-y-0"
            >
              Editar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {selectedTechnicalAreas.map((area) => (
              <span
                key={area.id}
                className="rounded-full border border-border px-3 py-1 text-sm text-ink"
              >
                {area.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-visible rounded-lg border border-border bg-surface py-0 ring-0">
        <CardHeader className="px-4 pt-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle
              role="heading"
              aria-level={3}
              className="text-sm font-semibold text-ink"
            >
              Tipos de orientación
            </CardTitle>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEditOrientationTypes}
              className="h-auto p-0 text-sm font-semibold text-accent hover:bg-transparent hover:text-accent active:translate-y-0"
            >
              Editar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {selectedOrientationTypes.map((orientation) => (
              <span
                key={orientation.id}
                className="rounded-full border border-border px-3 py-1 text-sm text-ink"
              >
                {orientation.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={onActivate}
        disabled={isActivating}
        className="h-auto w-full rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent active:translate-y-0 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isActivating ? "Activando..." : "Activar participación"}
      </Button>
    </div>
  );
}
