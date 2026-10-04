import { Terminal } from "lucide-react";

type MentorTechnicalAreasProps = {
  areas: string[];
};

export function MentorTechnicalAreas({ areas }: MentorTechnicalAreasProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-soft text-ink">
          <Terminal size={20} />
        </div>

        <h2 className="text-xl font-bold text-ink">Áreas técnicas</h2>
      </div>

      {areas.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <span
              key={area}
              className="max-w-full break-words rounded-lg border border-border bg-surface-soft px-4 py-2 text-sm font-medium text-ink"
            >
              {area}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">
          No hay áreas técnicas registradas.
        </p>
      )}
    </section>
  );
}
