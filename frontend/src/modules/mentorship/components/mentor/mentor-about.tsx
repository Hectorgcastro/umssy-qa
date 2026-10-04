import { Badge } from "lucide-react";

interface MentorAboutProps {
  description: string;
}

export function MentorAbout({ description }: MentorAboutProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-interaction text-accent">
          <Badge size={20} />
        </div>

        <h2 className="text-xl font-bold text-ink">Sobre mí</h2>
      </div>

      <p className="leading-7 text-text-secondary">{description}</p>
    </section>
  );
}
