interface OrientationOption {
  id: string;
  label: string;
}

interface OrientationStepProps {
  selectedOrientationTypeIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const ORIENTATION_OPTIONS: OrientationOption[] = [
  {
    id: "career-guidance",
    label: "Orientación profesional",
  },
  {
    id: "technical-guidance",
    label: "Orientación técnica",
  },
  {
    id: "job-search",
    label: "Búsqueda de empleo",
  },
  {
    id: "interview-preparation",
    label: "Preparación para entrevistas",
  },
];

export function OrientationStep({
  selectedOrientationTypeIds,
  onSelectionChange,
}: OrientationStepProps) {
  const toggleOrientation = (id: string) => {
    const isSelected = selectedOrientationTypeIds.includes(id);

    if (isSelected) {
      onSelectionChange(
        selectedOrientationTypeIds.filter(
          (orientationId) => orientationId !== id,
        ),
      );
      return;
    }

    onSelectionChange([...selectedOrientationTypeIds, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Tipos de orientación
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Selecciona los tipos de orientación que podrás brindar.
        </p>
      </div>

      <p className="text-sm font-medium text-ink">
        Orientaciones seleccionadas: {selectedOrientationTypeIds.length}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {ORIENTATION_OPTIONS.map((orientation) => {
          const isSelected = selectedOrientationTypeIds.includes(
            orientation.id,
          );

          return (
            <button
              key={orientation.id}
              type="button"
              onClick={() => toggleOrientation(orientation.id)}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 text-left"
            >
              <span className="text-sm font-medium text-ink">
                {orientation.label}
              </span>

              {isSelected && (
                <span className="rounded-full bg-accent px-2 py-1 text-xs font-semibold text-white">
                  Activo
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}