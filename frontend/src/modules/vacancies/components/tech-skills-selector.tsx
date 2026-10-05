"use client";

import { TechSkillsSelectorProps } from "../types";

export function TechSkillsSelector({
  skills,
  selectedSkills,
  onToggleSkill,
  onRemoveSkill,
  onOpenAddModal,
}: TechSkillsSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Indicador */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-amber-500 text-[10px] font-bold text-amber-500">
          i
        </span>
        <span>Selecciona las habilidades requeridas para facilitar el procesamiento de la oferta.</span>
      </div>

      {/* Lista de Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {skills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);

          return (
            <div key={skill} className="relative group inline-flex items-center">
              <button
                type="button"
                onClick={() => onToggleSkill(skill)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
                }`}
              >
                {skill}
              </button>

              {onRemoveSkill && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSkill(skill);
                  }}
                  title="Eliminar habilidad"
                  className="hidden group-hover:flex absolute -top-1 -right-1 h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <svg
                    className="h-2.5 w-2.5 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}

        {/* Botón Añadir */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="rounded-full border border-dashed border-amber-500 px-4 py-1.5 text-sm font-medium text-amber-800 bg-amber-50/40 hover:bg-amber-100/50 transition-colors"
        >
          + Añadir habilidad
        </button>
      </div>
    </div>
  );
}