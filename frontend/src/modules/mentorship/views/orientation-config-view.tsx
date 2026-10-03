"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Code,
  FileText,
  FolderGit2,
  Mic,
  Repeat,
} from "lucide-react";

const ORIENTATION_OPTIONS = [
  { id: "1", value: "tecnica", label: "Orientación técnica", icon: Code },
  { id: "2", value: "cv", label: "Revisión de CV", icon: FileText },
  {
    id: "3",
    value: "entrevista",
    label: "Preparación de entrevista",
    icon: Mic,
  },
  { id: "4", value: "cambio_area", label: "Cambio de área", icon: Repeat },
  {
    id: "5",
    value: "portafolio",
    label: "Revisión de portafolio",
    icon: FolderGit2,
  },
];

export function OrientationConfigView() {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "tecnica",
    "cv",
  ]);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckboxChange = (value: string) => {
    setErrorMessage(null);
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleSave = () => {
    // Validación AC-12: Impedir guardar la orientación nula o vacía
    if (selectedValues.length === 0) {
      setErrorMessage(
        "Debe seleccionar al menos un tipo de orientación antes de guardar.",
      );
      return;
    }

    setErrorMessage(null);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="min-h-full w-full bg-background">
      <div className="flex w-full flex-col">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-4 py-8 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <Link className="transition-colors hover:text-ink" href="/">
              UMSSY
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link
              className="transition-colors hover:text-ink"
              href="/mentorship/mentors"
            >
              Mentorías
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link
              className="transition-colors hover:text-ink"
              href="/mentors/participation"
            >
              Mi participación
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-semibold text-ink">
              Tipos de orientación
            </span>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Editar tipos de orientación
            </h1>
            <p className="pl-2 text-sm text-text-secondary">
              Selecciona los tipos de orientación que deseas brindar.
            </p>
          </div>

          {/* Main Card */}
          <div className="flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-8">
            {/* Mensaje de error si intenta guardar vacío (AC-12) */}
            {errorMessage && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Opciones */}
            <div className="flex flex-col gap-3">
              {ORIENTATION_OPTIONS.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const IconComponent = option.icon;

                return (
                  <label
                    key={option.id}
                    className={`group flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? "border-red-200 bg-red-50/50"
                        : "border-transparent bg-gray-50/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div
                        className={`shrink-0 rounded-lg p-2 transition-colors ${
                          isSelected
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <IconComponent size={20} />
                      </div>
                      <span className="min-w-0 break-words text-sm font-semibold text-ink">
                        {option.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(option.value)}
                      />
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          isSelected
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-transparent"
                        }`}
                      >
                        <Check size={16} />
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
              <Link
                href="/mentors/participation"
                className="flex h-10 items-center justify-center rounded-lg bg-gray-100 px-6 text-sm font-semibold text-ink transition-colors hover:bg-gray-200"
              >
                Volver
              </Link>
              <button
                type="button"
                onClick={handleSave}
                className="flex h-10 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demostración visual: no persiste cambios */}
      <div
        className={`fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-gray-900 px-6 py-3 text-white shadow-xl transition-all duration-300 sm:bottom-8 sm:left-auto sm:right-8 ${
          showToast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-20 opacity-0"
        }`}
        role="status"
      >
        <CheckCircle2 size={20} className="text-amber-400" />
        <span className="text-sm font-medium">
          Selección actualizada para esta demostración
        </span>
      </div>
    </div>
  );
}
