import type { EventItem } from '../types/event.types';

type EventRegistrationAvailability = {
  state: 'available' | 'full' | 'unknown';
  availableSpots: number | null;
};

export function getEventRegistrationAvailability(
  event: Pick<EventItem, 'capacity' | 'availableSpots' | 'registrationCount'>,
): EventRegistrationAvailability {
  const { capacity, availableSpots, registrationCount } = event;
  const unknown: EventRegistrationAvailability = {
    state: 'unknown',
    availableSpots: null,
  };

  if (!Number.isSafeInteger(registrationCount) || registrationCount < 0) {
    return unknown;
  }

  if (capacity === null && availableSpots === null) {
    return { state: 'available', availableSpots: null };
  }

  if (
    capacity === null ||
    !Number.isSafeInteger(capacity) ||
    capacity < 0 ||
    availableSpots === null ||
    !Number.isSafeInteger(availableSpots) ||
    availableSpots < 0 ||
    availableSpots !== Math.max(0, capacity - registrationCount)
  ) {
    return unknown;
  }

  return {
    state: availableSpots === 0 ? 'full' : 'available',
    availableSpots,
  };
}
