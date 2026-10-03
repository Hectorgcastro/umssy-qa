"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  getMentorParticipation,
  updateMentorParticipation,
} from "@/shared/services/mentor-participation.service";
import { ORIENTATION_TYPES } from "../data/orientation-types";

export function OrientationConfigView() {
  const [participation, setParticipation] = useState<
    ReturnType<typeof getMentorParticipation> | undefined
  >(undefined);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) return;

      const currentParticipation = getMentorParticipation();
      setParticipation(currentParticipation);

      if (currentParticipation) {
        setSelectedValues(
          ORIENTATION_TYPES.filter((orientation) =>
            currentParticipation.orientations.includes(orientation.label),
          ).map((orientation) => orientation.id),
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

    const orientations = ORIENTATION_TYPES.filter((orientation) =>
      selectedValues.includes(orientation.id),
    ).map((orientation) => orientation.label);

    updateMentorParticipation({ orientations });
    setErrorMessage(null);
    setShowToast(true);
  };

  if (participation === undefined) {
    return (
      <main className="min-h-full bg-background px-4 py-8 sm:px-8">
        <section
          className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          aria-busy="true"
        >
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Editar tipos de orientación
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Cargando tu participación como mentor…
          </p>
        </section>
      </main>
    );
  }

  if (participation === null) {
    return (
      <main className="min-h-full bg-background px-4 py-8 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Editar tipos de orientación
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Primero debes activar tu participación como mentor para editar los
            tipos de orientación que deseas brindar.
          </p>
          <Link
            href="/mentorship"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Activar participación como mentor
          </Link>
        </section>
      </main>
    );
  }

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
              {ORIENTATION_TYPES.map((option) => {
                const isSelected = selectedValues.includes(option.id);

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
                      <span className="min-w-0 break-words text-sm font-semibold text-ink">
                        {option.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(option.id)}
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
                disabled={selectedValues.length === 0}
                className="flex h-10 items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-gray-900 px-6 py-3 text-white shadow-xl sm:bottom-8 sm:left-auto sm:right-8"
          role="status"
        >
          <CheckCircle2 size={20} className="text-amber-400" />
          <span className="text-sm font-medium">
            Tipos de orientación actualizados correctamente
          </span>
        </div>
      )}
    </div>
  );
}
