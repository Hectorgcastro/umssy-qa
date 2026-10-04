"use client";

type ParticipationStepProps = {
  isParticipating: boolean;
  onParticipationChange: (value: boolean) => void;
};

export function ParticipationStep({
  isParticipating,
  onParticipationChange,
}: ParticipationStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Participación
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Configura tu participación como mentor.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-4">
        <input
          type="checkbox"
          checked={isParticipating}
          onChange={(event) =>
            onParticipationChange(event.target.checked)
          }
          className="mt-1 h-4 w-4"
        />

        <div>
          <p className="text-sm font-semibold text-ink">
            Quiero participar como mentor
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Activa esta opción para continuar con la configuración de mentoría.
          </p>
        </div>
      </label>
    </div>
  );
}
