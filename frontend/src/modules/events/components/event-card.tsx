'use client';

import { Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { EventCardProps } from '../types/event.types';

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  tecnologia: 'bg-slate-200/80 text-ink',
  'ia & datos': 'bg-amber-100/80 text-amber-800',
  diseno: 'bg-slate-200/80 text-ink',
  seguridad: 'bg-interaction text-danger',
};

function getCategoryBadgeClasses(categoryName: string): string {
  const normalizedKey = categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return CATEGORY_BADGE_STYLES[normalizedKey] ?? 'bg-slate-200/80 text-ink';
}

// Formatea la columna event_date (YYYY-MM-DD o ISO) al formato en espanol del mockup
export function formatEventDate(eventDate: string): string {
  const datePart = eventDate.split('T')[0];
  const parts = datePart.split('-').map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return eventDate;
  }

  const [year, month, day] = parts;
  const dateObj = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(dateObj);
}

// Formatea las columnas start_time y end_time (HH:mm:ss o ISO) a HH:mm - HH:mm
export function formatTimeRange(startTime: string, endTime: string): string {
  const extractHoursMinutes = (timeValue: string): string => {
    const timeMatch = timeValue.match(/(\d{2}:\d{2})/);
    return timeMatch ? timeMatch[1] : timeValue;
  };

  return `${extractHoursMinutes(startTime)} - ${extractHoursMinutes(endTime)}`;
}

export function EventCard({
  event,
  isSelected = false,
  onSelect,
}: EventCardProps) {
  const capacity = event.capacity;
  const hasCapacityLimit = capacity !== null && capacity > 0;
  const occupancyPercentage = hasCapacityLimit
    ? Math.min(Math.round((event.registrationCount / capacity) * 100), 100)
    : null;
  const isFull = hasCapacityLimit && event.registrationCount >= capacity;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(event);
    }
  };

  const handleKeyDown = (keyboardEvent: React.KeyboardEvent<HTMLDivElement>) => {
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'bg-surface border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs transition-colors cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected
          ? 'border-ink ring-1 ring-ink'
          : 'border-border hover:border-border-strong',
      )}
    >
      {/* Cabecera de la tarjeta: Nombre de la categoria desde la relacion event_category */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            getCategoryBadgeClasses(event.category.name),
          )}
        >
          {event.category.name}
        </span>
        {isFull && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-interaction text-danger">
            Lleno
          </span>
        )}
      </div>

      {/* Cuerpo central: Titulo, event_date y rango start_time - end_time */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-base font-bold text-ink leading-snug">
          {event.title}
        </h2>

        <div className="flex flex-col gap-1.5 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{formatTimeRange(event.startTime, event.endTime)}</span>
          </div>
        </div>
      </div>

      {/* Pie de la tarjeta: Indicador de inscritos confirmados sobre capacity */}
      <div className="flex items-center gap-3 pt-1">
        {occupancyPercentage !== null ? (
          <div
            role="progressbar"
            aria-label="Ocupación del taller"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={occupancyPercentage}
            className="flex-1 bg-slate-200/80 h-2 rounded-full overflow-hidden"
          >
            <div
              className={cn(
                'h-full rounded-full',
                isFull ? 'bg-accent' : 'bg-gold',
              )}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        ) : (
          <span className="flex-1 text-xs text-text-secondary">
            Sin limite de cupos
          </span>
        )}
        <span className="text-xs font-medium text-text-secondary shrink-0">
          {hasCapacityLimit
            ? `${event.registrationCount}/${capacity}`
            : `${event.registrationCount} inscritos`}
        </span>
      </div>
    </Card>
  );
}