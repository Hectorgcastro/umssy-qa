"use client";

import { useState } from "react";
import { PassCard } from "../components/pass-card";
import { PassDetail } from "../components/pass-detail";

export function MyPassesView() {
  const [selectedPass, setSelectedPass] = useState(1);

  return (
    // Cambiamos bg-surface por bg-transparent para que se funda con la barra superior
    <div className="flex flex-col lg:flex-row h-full w-full min-h-screen bg-transparent">
      
      {/* Columna Izquierda: Lista de Pases */}
      {/* Redujimos un poco el padding superior (pt-4) para que no quede tan separado del menú */}
      <div className="flex-1 p-8 pt-4 lg:p-12 lg:pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-ink mb-1">Mis Inscripciones</h1>
          <p className="text-text-secondary text-sm">1 pase · disponible sin Internet</p>
        </div>

        <div className="max-w-md">
          <PassCard 
            title="Desarrollo Web con React"
            date="jueves, 15 de octubre"
            status="Confirmada"
            isSelected={selectedPass === 1}
            onClick={() => setSelectedPass(1)}
          />
        </div>
      </div>

      {/* Columna Derecha: Detalle y QR */}
      <div className="w-full lg:w-[480px] border-l border-border bg-surface-soft/30 p-8 pt-4 lg:p-12 lg:pt-6 shrink-0">
        <PassDetail />
      </div>

    </div>
  );
}