import { Search } from "lucide-react";

// Sin acción todavía: la búsqueda por correo se conectará cuando el backend exponga el filtro.
export function EmailSearchInput() {
  return (
    <div className="relative w-full sm:w-96">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Buscar por correo electrónico"
        aria-label="Buscar por correo electrónico"
        className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-text-secondary focus:border-ink-soft focus:outline-none"
      />
    </div>
  );
}
