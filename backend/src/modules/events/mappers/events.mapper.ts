import type {
  EventWithRelations,
  EventItemResponse,
  EventsListResponse,
} from '../types/events.types.js';

export function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatUtcTime(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function mapEventToResponse(
  record: EventWithRelations,
  availableSpots: number | null,
): EventItemResponse {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    eventDate: formatUtcDate(record.eventDate),
    startTime: formatUtcTime(record.startTime),
    endTime: formatUtcTime(record.endTime),
    location: record.location,
    capacity: record.capacity,
    availableSpots,
    registeredCount: record._count.registrations,
    category: {
      id: record.category.id,
      name: record.category.name,
    },
    statusId: record.statusId,
  };
}

export function mapEventsToListResponse(
  records: EventWithRelations[],
  total: number,
  page: number,
  limit: number,
): EventsListResponse {
  const offset = (page - 1) * limit;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  const items = records.map((record) => {
    const registeredCount = record._count.registrations;
    const availableSpots =
      record.capacity === null
        ? null
        : Math.max(0, record.capacity - registeredCount);

    return mapEventToResponse(record, availableSpots);
  });

  return {
    data: {
      items,
      total,
      limit,
      totalPages,
    },
    page,
    offset,
  };
}
