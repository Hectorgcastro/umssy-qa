import { Search, X } from "lucide-react";

interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchInput({ value, onChange }: UserSearchInputProps) {
  return (
    <div className="relative w-full sm:w-96">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre, correo o identificador"
        aria-label="Buscar por nombre, correo o identificador"
        maxLength={100}
        className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-text-secondary focus:border-ink-soft focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-secondary transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
