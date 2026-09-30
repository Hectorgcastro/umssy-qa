"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  label: string;
  placeholder: string;
  onChange?: (value: string) => void;
}

export function SearchInput({ label, placeholder, onChange }: SearchInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function updateValue(nextValue: string) {
    setValue(nextValue);
    onChange?.(nextValue);
  }

  function clearValue() {
    updateValue("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
      />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => updateValue(event.target.value)}
        className="h-11 w-full rounded-md border border-border-strong bg-surface pl-10 pr-10 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-text-secondary hover:border-ink-soft focus:border-ink-soft focus:ring-2 focus:ring-ink/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={clearValue}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary transition-colors hover:bg-surface-soft hover:text-ink"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
