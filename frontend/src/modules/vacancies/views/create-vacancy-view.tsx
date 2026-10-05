"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export function CreateVacancyView() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [jobTitle, setJobTitle] = useState("");
  const [modality, setModality] = useState("Híbrido");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [vacancyCount, setVacancyCount] = useState("1");
  const [salary, setSalary] = useState("");
  const [languages, setLanguages] = useState("");

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    if (allowedKeys.includes(e.key)) return;

    const isAlphanumericOrSpace = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ]+$/.test(e.key);
    if (!isAlphanumericOrSpace || jobTitle.length >= 60) {
      e.preventDefault();
    }
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    if (allowedKeys.includes(e.key)) return;

    const isNumber = /^[0-9]+$/.test(e.key);
    if (!isNumber) {
      e.preventDefault();
    }
  };

  const handleVacancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") {
      setVacancyCount("");
      return;
    }
    const num = parseInt(value, 10);
    if (num <= 500) {
      setVacancyCount(num.toString());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">Registrar nueva vacante</h1>
      <p className="text-slate-500 mb-8">Completa la información de la oferta para publicarla en la plataforma.</p>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold border-b pb-4">Información y condiciones de la oferta</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Título del puesto <span className="text-red-500">*</span></label>
              <Input placeholder="Ej. Desarrollador Backend" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} onKeyDown={handleTitleKeyDown} />
              <span className="text-xs text-slate-400 text-right">{jobTitle.length}/60</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Modalidad <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <Button type="button" variant={modality === "Presencial" ? "default" : "outline"} className={`flex-1 ${modality === "Presencial" ? "bg-slate-900 text-white" : ""}`} onClick={() => setModality("Presencial")}>Presencial</Button>
                  <Button type="button" variant={modality === "Remoto" ? "default" : "outline"} className={`flex-1 ${modality === "Remoto" ? "bg-slate-900 text-white" : ""}`} onClick={() => setModality("Remoto")}>Remoto</Button>
                  <Button type="button" variant={modality === "Híbrido" ? "default" : "outline"} className={`flex-1 ${modality === "Híbrido" ? "bg-slate-900 text-white" : ""}`} onClick={() => setModality("Híbrido")}>Híbrido</Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Enlace de Google Maps <span className="text-red-500">*</span></label>
                <Input placeholder="https://maps.google.com/..." value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Número de vacantes <span className="text-red-500">*</span></label>
                <Input type="text" value={vacancyCount} onChange={handleVacancyChange} onKeyDown={handleNumberKeyDown} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Salario <span className="text-red-500">*</span></label>
                {/* Input de salario sin la máscara para este commit */}
                <Input placeholder="Bs 6.500 - 8.000" value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-1/2 pr-3">
              <label className="text-sm font-medium text-slate-700">Idiomas <span className="text-red-500">*</span></label>
              <Input placeholder="Español, inglés intermedio" value={languages} onChange={(e) => setLanguages(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => console.log("Cancelar click")}>Cancelar</Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setCurrentStep(2)}>Continuar</Button>
      </div>
    </div>
  );
}