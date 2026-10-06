import React from 'react';
import type { VacancyConditions } from "../hooks/use-job-offer-form";

interface PreviewStepProps {
  conditions: VacancyConditions;
  isLoading: boolean;
  error: string | null;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export function PreviewStep({ conditions, isLoading, error, onSubmit, onBack }: PreviewStepProps) {
  const FIXED_COMPANY = "TechBolivia S.R.L.";
  const MOCK_SKILLS = ["Python", "Docker", "Git"];
  const MOCK_DESCRIPTION = "Buscamos un desarrollador backend con experiencia en Python y arquitecturas de microservicios. Será responsable del diseño e implementación de APIs RESTful...";

  const handleSubmit = async () => {
      try {
          await onSubmit();
          alert("¡Oferta publicada con éxito!"); 
      } catch (e) {
      }
  };

  return (
    <div className="w-full mt-8">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
          <span className="font-semibold">Aviso:</span> {error}
        </div>
      )}

      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        VISTA PREVIA DE LA PUBLICACIÓN
      </h3>

      <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-gray-100 border-t-[4px] border-t-[#E50000] p-8">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#0f172a] text-white w-[50px] h-[50px] flex items-center justify-center rounded-lg font-bold text-lg tracking-wider">
            TB
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-[15px] leading-tight">{FIXED_COMPANY}</h4>
            <p className="text-[13px] text-gray-500">Empresa verificada</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[22px] font-extrabold text-gray-900">
            {conditions.title || "Desarrollador Backend"}
          </h2>
          <p className="text-amber-500 font-bold text-[13px] mt-1">
            {conditions.category || "Tecnología"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-[13px] font-medium">
            {conditions.modality || "Híbrido"}
          </div>
          <div className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-[13px] font-medium">
            {conditions.contractType || "Tiempo completo"}
          </div>
          <div className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-[13px] font-medium">
            {conditions.vacancyCount ? `${conditions.vacancyCount} vacantes` : "2 vacantes"}
          </div>
          <div className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-md text-[13px] font-medium">
            {conditions.salary || "Bs 6.500 - 8.000"}
          </div>
        </div>

        <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
          {MOCK_DESCRIPTION} <span className="text-[#E50000] font-semibold cursor-pointer">Ver más</span>
        </p>

        <hr className="border-gray-100 mb-5" />

        <div className="mb-5">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-1">Idiomas</h4>
          <p className="text-[14px] text-gray-600">
            {conditions.languages || "Español, Inglés intermedio"}
          </p>
        </div>

        <hr className="border-gray-100 mb-5" />

        <div className="mb-6">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-1">Ubicación</h4>
          <a href={conditions.mapsLink || "#"} className="text-[14px] text-[#E50000] hover:underline underline-offset-2">
            {conditions.mapsLink || "https://maps.google.com/?q=Cochabamba"}
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {MOCK_SKILLS.map((skill, index) => (
            <span key={index} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-[13px] font-semibold rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2.5 bg-[#E50000] hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            "Confirmar publicación"
          )}
        </button>
      </div>
    </div>
  );
}