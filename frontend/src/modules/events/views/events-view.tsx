'use client';

import { useState } from 'react';
import { Info, Search } from 'lucide-react';
import { EventCard } from '../components/event-card';
import { EventDetailPanel } from '../components/event-detail-panel';
import { useEvents } from '../hooks/use-events';
import type { EventItem } from '../types/event.types';

const MOCKUP_CATEGORIES = ['Todos', 'Tecnologia', 'IA & Datos', 'Diseno', 'Seguridad'];

export function EventsView() {
  const {
    events,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    retry,
  } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleSelectEvent = (selectedEvent: EventItem) => {
    setSelectedEventId(selectedEvent.id);
  };

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className="flex min-h-svh w-full flex-1 flex-col bg-surface-soft text-foreground lg:flex-row">

      <div className="flex min-w-0 flex-1 flex-col gap-6 px-6 pb-8 pt-20 sm:px-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Talleres disponibles
          </h1>
          <p className="text-sm text-text-secondary">
            {events.length} talleres cargados
          </p>
        </header>


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


        <section aria-label="Listado de talleres">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((eventItem) => (
              <EventCard
                key={eventItem.id}
                event={eventItem}
                isSelected={selectedEventId === eventItem.id}
                onSelect={handleSelectEvent}
              />
            ))}
          </div>
          {isLoading && events.length === 0 && (
            <p role="status" className="py-10 text-center text-text-secondary">
              Cargando talleres...
            </p>
          )}
          {!isLoading && !error && events.length === 0 && (
            <p className="py-10 text-center text-text-secondary">
              No hay talleres disponibles.
            </p>
          )}
          {error && (
            <div role="alert" className="py-6 text-center">
              <p className="text-sm text-danger">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 text-sm font-semibold text-ink underline underline-offset-4"
              >
                Reintentar
              </button>
            </div>
          )}
          {hasMore && !error && (
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:cursor-wait disabled:opacity-60"
              >
                {isLoadingMore ? 'Cargando...' : 'Cargar más talleres'}
              </button>
            </div>
          )}
        </section>
      </div>


      {selectedEvent ? (
        <EventDetailPanel key={selectedEvent.id} event={selectedEvent} />
      ) : (
        <aside
          aria-label="Detalle del taller seleccionado"
          className="w-full shrink-0 border-t border-border bg-surface p-8 text-center lg:min-h-svh lg:w-[340px] lg:self-stretch lg:border-l lg:border-t-0 xl:w-[360px]"
        >
          <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
            <h2 className="text-lg font-bold text-ink">Selecciona un taller</h2>
            <p className="text-xs leading-relaxed text-text-secondary">
              Elige un taller de la lista para ver su información y opciones de
              inscripción.
            </p>
            <div className="mt-2 flex size-12 items-center justify-center rounded-2xl border border-border bg-surface-soft text-text-secondary">
              <Info aria-hidden="true" className="size-5" />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
