import { ChevronRight } from "lucide-react";

interface MentorProfileNavigationProps {
  mentorName: string;
}

export function MentorProfileNavigation({
  mentorName,
}: MentorProfileNavigationProps) {
  return (
    <nav
      aria-label="Ruta de navegación"
      className="mb-6 flex flex-wrap items-center gap-1 text-sm"
    >
      <span className="text-umssy-secondary">UMSSY</span>

      <ChevronRight size={16} className="text-umssy-secondary" />

      <span className="text-umssy-secondary">Mentorías</span>

      <ChevronRight size={16} className="text-umssy-secondary" />

      <span className="text-umssy-secondary">Directorio de mentores</span>

      <ChevronRight size={16} className="text-umssy-secondary" />

      <span className="font-semibold text-umssy-ink">{mentorName}</span>
    </nav>
  );
}
