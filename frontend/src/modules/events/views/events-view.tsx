'use client';

import { useState } from 'react';
import { Info, Search } from 'lucide-react';
import { EventCard } from '../components/event-card';
import type { EventItem } from '../types/event.types';

// Semilla local con la estructura exacta de las tablas event y event_category del ER
const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1a2b3c4-0001-4000-8000-000000000001',
    title: 'Desarrollo Web con React',
    description: 'Taller practico de desarrollo frontend moderno con React.',
    category: { id: 'a1a1a1a1-0001-4000-8000-000000000001', name: 'Tecnologia' },
    instructorName: 'Ing. Carlos Mendoza',
    eventDate: '2026-10-15',
    startTime: '09:00:00',
    endTime: '13:00:00',
    location: 'Auditorio FCyT',
    capacity: 30,
    availableSpots: 6,
    registrationCount: 24,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0001-4000-8000-000000000001',
  },
  {
    id: 'e1a2b3c4-0002-4000-8000-000000000002',
    title: 'Inteligencia Artificial Aplicada',
    description: 'Introduccion practica a modelos de IA y analisis de datos.',
    category: { id: 'a1a1a1a1-0002-4000-8000-000000000002', name: 'IA & Datos' },
    instructorName: 'Dra. Elena Rojas',
    eventDate: '2026-10-18',
    startTime: '14:00:00',
    endTime: '18:00:00',
    location: null,
    capacity: 50,
    availableSpots: 38,
    registrationCount: 12,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0002-4000-8000-000000000002',
  },
  {
    id: 'e1a2b3c4-0003-4000-8000-000000000003',
    title: 'Diseno UI/UX para Moviles',
    description: 'Principios de diseno de interfaces y experiencia de usuario.',
    category: { id: 'a1a1a1a1-0003-4000-8000-000000000003', name: 'Diseno' },
    instructorName: 'Lic. Marco Siles',
    eventDate: '2026-10-22',
    startTime: '08:30:00',
    endTime: '12:30:00',
    location: 'Laboratorio 3 Infocal',
    capacity: 20,
    availableSpots: 0,
    registrationCount: 20,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0001-4000-8000-000000000001',
  },
  {
    id: 'e1a2b3c4-0004-4000-8000-000000000004',
    title: 'Seguridad Informatica Basica',
    description: 'Fundamentos de ciberseguridad y proteccion de aplicaciones.',
    category: { id: 'a1a1a1a1-0004-4000-8000-000000000004', name: 'Seguridad' },
    instructorName: 'Ing. Roberto Vargas',
    eventDate: '2026-10-28',
    startTime: '15:00:00',
    endTime: '19:00:00',
    location: 'Aula Magna FCyT',
    capacity: 25,
    availableSpots: 20,
    registrationCount: 5,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0001-4000-8000-000000000001',
  },
  {
    id: 'e1a2b3c4-0005-4000-8000-000000000005',
    title: 'Bases de Datos NoSQL',
    description: 'Modelado y consultas en bases de datos documentales.',
    category: { id: 'a1a1a1a1-0001-4000-8000-000000000001', name: 'Tecnologia' },
    instructorName: 'Ing. Patricia Flores',
    eventDate: '2026-11-05',
    startTime: '10:00:00',
    endTime: '14:00:00',
    location: null,
    capacity: 20,
    availableSpots: 5,
    registrationCount: 15,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0002-4000-8000-000000000002',
  },
  {
    id: 'e1a2b3c4-0006-4000-8000-000000000006',
    title: 'Data Science con Python',
    description: 'Procesamiento y visualizacion de datos con librerias de Python.',
    category: { id: 'a1a1a1a1-0002-4000-8000-000000000002', name: 'IA & Datos' },
    instructorName: 'MSc. Daniel Torrez',
    eventDate: '2026-11-12',
    startTime: '08:00:00',
    endTime: '12:00:00',
    location: 'Laboratorio Computo 1',
    capacity: 60,
    availableSpots: 25,
    registrationCount: 35,
    statusId: 'b1b1b1b1-0001-4000-8000-000000000001',
    modalityId: 'c1c1c1c1-0001-4000-8000-000000000001',
  },
];

const MOCKUP_CATEGORIES = ['Todos', 'Tecnologia', 'IA & Datos', 'Diseno', 'Seguridad'];

export function EventsView() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleSelectEvent = (selectedEvent: EventItem) => {
    setSelectedEventId(selectedEvent.id);
  };

  return (
    <div className="min-h-full w-full flex-1 bg-surface-soft text-foreground flex flex-col lg:flex-row">
      {/* Columna central: Catalogo de talleres disponibles */}
      <div className="flex-1 px-6 sm:px-10 py-8 flex flex-col gap-6 min-w-0">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Talleres disponibles
          </h1>
          <p className="text-sm text-text-secondary">
            {INITIAL_EVENTS.length} talleres · Gestion 2026
          </p>
        </header>

        {/* Barra horizontal combinada: Buscador por texto + Chips de categorias */}
        <div
          role="search"
          aria-label="Filtros de talleres"
          className="flex flex-wrap items-center gap-2.5"
        >
          <div className="w-full sm:w-64 h-10 rounded-full bg-surface border border-border px-4 flex items-center gap-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-text-secondary shrink-0" aria-hidden="true" />
            <span className="text-sm text-text-secondary truncate">
              Buscar taller...
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {MOCKUP_CATEGORIES.map((categoryName, index) => {
              const isSelected = index === 0;
              return (
                <span
                  key={categoryName}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-ink text-white'
                      : 'bg-surface text-ink border border-border'
                  }`}
                >
                  {categoryName}
                </span>
              );
            })}
          </div>
        </div>

        {/* Grilla de 2 columnas renderizando el componente reutilizable EventCard */}
        <section aria-label="Listado de talleres">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INITIAL_EVENTS.map((eventItem) => (
              <EventCard
                key={eventItem.id}
                event={eventItem}
                isSelected={selectedEventId === eventItem.id}
                onSelect={handleSelectEvent}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Columna derecha del mockup: Panel de detalle */}
      <aside
        aria-label="Detalle del taller seleccionado"
        className="w-full lg:w-80 xl:w-96 bg-surface border-t lg:border-t-0 lg:border-l border-border p-8 flex flex-col items-center justify-center text-center shrink-0"
      >
        <div className="max-w-xs flex flex-col items-center gap-3">
          <h2 className="text-lg font-bold text-ink">
            Selecciona un taller
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Elige un taller de la lista para ver su informacion y opciones de inscripcion
          </p>
          <div className="mt-2 w-12 h-12 rounded-2xl bg-surface-soft border border-border flex items-center justify-center text-text-secondary">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </aside>
    </div>
  );
}