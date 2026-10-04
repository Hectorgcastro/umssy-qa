import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  calculateEventCapacityStatus,
  formatEventDate,
  formatTimeRange,
} from './event-card';
import type { EventItem } from '../types/event.types';
import { getEventRegistrationAvailability } from '../utils/event-registration-availability';

type EventDetailPanelProps = {
  event: EventItem;
};

function DetailRow({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof CalendarDays;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2 text-sm text-text-secondary">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span className="sr-only">{label}: </span>
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}

export function EventDetailPanel({ event }: EventDetailPanelProps) {
  const availability = getEventRegistrationAvailability(event);
  const hasValidCapacity = availability.state !== 'unknown';
  const { enrolledCount, capacity, progressPercentage } =
    hasValidCapacity
      ? calculateEventCapacityStatus(event)
      : { enrolledCount: 0, capacity: null, progressPercentage: null };
  const capacityDescription = !hasValidCapacity
    ? 'Información de cupos no disponible.'
    : availability.state === 'full'
      ? 'No hay cupos disponibles.'
      : capacity === null
        ? 'Sin límite de cupos'
        : `${availability.availableSpots} cupos disponibles`;

  return (
    <aside
      aria-label={`Detalle de ${event.title}`}
      className="w-full shrink-0 border-t border-border bg-surface lg:min-h-svh lg:w-[340px] lg:self-stretch lg:border-l lg:border-t-0 xl:w-[360px]"
    >
      <div className="space-y-5 px-6 py-7 lg:px-7">
        <header className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-text-secondary">
            {event.category.name}
          </span>
          <h2 className="break-words text-lg font-bold leading-6 text-ink">
            {event.title}
          </h2>
        </header>

        <dl className="space-y-2 border-b border-border pb-4">
          <DetailRow
            icon={CalendarDays}
            label="Fecha"
            value={formatEventDate(event.eventDate)}
          />
          <DetailRow
            icon={Clock3}
            label="Horario"
            value={formatTimeRange(event.startTime, event.endTime)}
          />
          <DetailRow
            icon={MapPin}
            label="Lugar"
            value={event.location?.trim() || 'Por confirmar'}
          />
          <DetailRow
            icon={UserRound}
            label="Instructor"
            value={event.instructorName?.trim() || 'Por confirmar'}
          />
        </dl>

        <section aria-labelledby="event-description-title" className="space-y-2">
          <h3
            className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
            id="event-description-title"
          >
            Descripción
          </h3>
          <p className="whitespace-pre-line break-words text-sm leading-5 text-text-secondary">
            {event.description?.trim() || 'Descripción por confirmar.'}
          </p>
        </section>

        <section aria-labelledby="event-capacity-title" className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
              id="event-capacity-title"
            >
              Cupos
            </h3>
            <span className="text-xs font-semibold text-ink">
              {!hasValidCapacity
                ? 'Por confirmar'
                : capacity === null
                  ? `${enrolledCount} inscritos`
                  : `${enrolledCount} de ${capacity}`}
            </span>
          </div>
          {progressPercentage !== null && (
            <div
              aria-label={`Ocupación del taller: ${progressPercentage}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progressPercentage}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
            >
              <div
                className={`h-full rounded-full transition-[width] ${availability.state === 'full' ? 'bg-accent' : 'bg-gold'}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
          <p
            aria-live="polite"
            className="text-xs text-text-secondary"
            id="event-capacity-description"
          >
            {capacityDescription}
          </p>
        </section>

        <Button
          aria-describedby="event-capacity-description"
          className="mt-2 min-h-11 w-full bg-accent text-white hover:bg-danger disabled:cursor-not-allowed disabled:bg-muted disabled:text-text-secondary disabled:opacity-100"
          disabled={availability.state !== 'available'}
          size="lg"
          type="button"
        >
          Inscribirme
        </Button>
      </div>
    </aside>
  );
}
