'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { EventCard } from '../components/event-card';
import { EventDetailPanel } from '../components/event-detail-panel';
import { useEvents } from '../hooks/use-events';
import { useEventsFilters } from '../hooks/use-events-filters';
import { useEventCategories } from '../hooks/use-event-categories';
import { EventsSearchInput } from '../components/events-search-input';
import { CategoryFilterChips } from '../components/category-filter-chips';
import type { EventItem } from '../types/event.types';

export function EventsView() {
  const { searchInput, setSearchInput, categoryId, setCategoryId, filters } =
    useEventsFilters();
  const { categories } = useEventCategories();
  const {
    events,
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    retry,
  } = useEvents(filters);
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
          <EventsSearchInput value={searchInput} onChange={setSearchInput} />
          <CategoryFilterChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
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
          className="flex min-h-80 w-full shrink-0 items-center justify-center border-t border-border bg-surface p-8 text-center lg:min-h-svh lg:w-[340px] lg:self-stretch lg:border-l lg:border-t-0 xl:w-[360px]"
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
