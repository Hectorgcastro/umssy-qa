'use client';

import React, { useState } from 'react';
import { 
  Code, 
  FileText, 
  Mic, 
  Repeat, 
  FolderGit2, 
  Check, 
  ChevronRight, 
  School, 
  Bell, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';

const ORIENTATION_OPTIONS = [
  { id: '1', value: 'tecnica', label: 'Orientación técnica', icon: Code },
  { id: '2', value: 'cv', label: 'Revisión de CV', icon: FileText },
  { id: '3', value: 'entrevista', label: 'Preparación de entrevista', icon: Mic },
  { id: '4', value: 'cambio_area', label: 'Cambio de área', icon: Repeat },
  { id: '5', value: 'portafolio', label: 'Revisión de portafolio', icon: FolderGit2 },
];

export function OrientationConfigView() {
  const [selectedValues, setSelectedValues] = useState<string[]>(['tecnica', 'cv']);
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
      setErrorMessage('Debe seleccionar al menos un tipo de orientación antes de guardar.');
      return;
    }

    setErrorMessage(null);
    // Lógica de guardado exitoso
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="w-full pt-16 bg-background min-h-screen">
      <div className="flex flex-col w-full">
        <div className="px-8 py-8 max-w-[1180px] w-full mx-auto flex flex-col gap-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-secondary text-sm">
            <a className="hover:text-on-surface transition-colors" href="#">UMSSY</a>
            <ChevronRight size={14} />
            <a className="hover:text-on-surface transition-colors" href="#">Mentorías</a>
            <ChevronRight size={14} />
            <a className="hover:text-on-surface transition-colors" href="#">Mi participación</a>
            <ChevronRight size={14} />
            <span className="text-on-surface font-semibold">Tipos de orientación</span>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Editar tipos de orientación</h1>
            <p className="text-sm text-secondary pl-2">
              Selecciona los tipos de orientación que deseas brindar.
            </p>
          </div>

          {/* Main Card */}
          <div className="max-w-3xl w-full bg-white rounded-xl shadow-sm p-8 flex flex-col gap-6 border border-gray-100">
            
            {/* Mensaje de error si intenta guardar vacío (AC-12) */}
            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm">
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
                    className={`group flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer border ${
                      isSelected 
                        ? 'bg-red-50/50 border-red-200' 
                        : 'bg-gray-50/50 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'text-primary bg-red-100' : 'text-gray-500 bg-gray-100'}`}>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-sm font-semibold text-on-surface">{option.label}</span>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(option.value)}
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-transparent'
                      }`}>
                        <Check size={16} />
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <a 
                href="#" 
                className="h-10 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-on-surface text-sm font-semibold flex items-center justify-center transition-colors"
              >
                Volver
              </a>
              <button
                type="button"
                onClick={handleSave}
                className="h-10 px-6 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center transition-colors shadow-sm"
              >
                Guardar cambios
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast de Éxito */}
      <div className={`fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 z-50 ${
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
        <CheckCircle2 size={20} className="text-amber-400" />
        <span className="text-sm font-medium">Cambios guardados con éxito en tu perfil</span>
      </div>
    </div>
  );
}