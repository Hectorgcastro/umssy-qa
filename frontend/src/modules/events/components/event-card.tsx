'use client';

import { Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CATEGORY_BADGE_STYLES } from '../constants/event-card.constants';
import type {
  EventCapacityStatus,
  EventCardProps,
  EventItem,
} from '../types/event.types';

function getCategoryBadgeClasses(categoryName: string): string {
  const normalizedKey = categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return CATEGORY_BADGE_STYLES[normalizedKey] ?? 'bg-slate-200/80 text-ink';
}

export function calculateEventCapacityStatus(
  event: EventItem,
): EventCapacityStatus {
  const enrolledCount = Math.max(0, event.registrationCount);
  const { capacity, availableSpots } = event;

  if (capacity === null) {
    return {
      enrolledCount,
      capacity: null,
      progressPercentage: null,
      isFull: false,
    };
  }

  const safeCapacity = Math.max(0, capacity);
  const isFull = availableSpots === 0 || enrolledCount >= safeCapacity;
  const progressPercentage =
    safeCapacity === 0
      ? 100
      : Math.min(Math.round((enrolledCount / safeCapacity) * 100), 100);

  return {
    enrolledCount,
    capacity,
    progressPercentage,
    isFull,
  };
}

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
  const { enrolledCount, capacity, progressPercentage, isFull } =
    calculateEventCapacityStatus(event);

  const categoryName = event.category.name;

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
      {}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            getCategoryBadgeClasses(categoryName),
          )}
        >
          {categoryName}
        </span>

        {isFull && (
          <span
            data-testid="event-full-badge"
            className="text-xs font-semibold px-3 py-1 rounded-full bg-interaction text-danger"
          >
            Lleno
          </span>
        )}
      </div>

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

      <div className="flex items-center gap-3 pt-1">
        {progressPercentage === null ? (
          <span className="flex-1 text-xs text-text-secondary">
            Sin limite de cupos
          </span>
        ) : (
          <div
            role="progressbar"
            aria-label={`Cupos ocupados para ${event.title}`}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="flex-1 bg-slate-200/80 h-2 rounded-full overflow-hidden"
          >
            <div
              data-testid="event-capacity-bar"
              className={cn(
                'h-full rounded-full transition-all',
                isFull ? 'bg-accent' : 'bg-gold',
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        <span className="text-xs font-medium text-text-secondary shrink-0">
          {capacity === null
            ? `${enrolledCount} inscritos`
            : `${enrolledCount}/${capacity}`}
        </span>
      </div>
    </Card>
  );
}