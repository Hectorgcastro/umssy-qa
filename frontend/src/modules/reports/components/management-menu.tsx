"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Settings } from "lucide-react";

// Periodos de ejemplo hasta que el backend exponga la gestión académica.
const ACADEMIC_PERIODS = ["I-2026", "II-2026", "I-2025", "II-2025"];

// Solo abre y cierra el menú: las opciones se conectarán cuando el backend las exponga.
export function ManagementMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="management-menu"
        className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink-soft"
      >
        <Settings className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        Gestión
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id="management-menu"
          role="menu"
          aria-label="Gestión"
          className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {ACADEMIC_PERIODS.map((period) => (
            <li key={period} role="none">
              <button
                type="button"
                role="menuitem"
                className="w-full px-4 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
              >
                {period}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
