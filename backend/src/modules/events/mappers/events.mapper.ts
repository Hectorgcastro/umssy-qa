import type { EventRawRecord, EventItemResponse, EventsListResponse } from '../types/events.types.js';

/**
 * Formatea una fecha Date UTC a string YYYY-MM-DD.
 * Se usan métodos UTC para evitar desfases por zona horaria del servidor.
 */
export function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha Date UTC a string HH:mm.
 * Prisma devuelve los campos Time como Date con fecha epoch 1970-01-01.
 */
export function formatUtcTime(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function mapEventToResponse(
  record: EventRawRecord,
  availableSpots: number | null,
): EventItemResponse {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: {
      id: record.category.id,
      name: record.category.name,
    },
    instructorName: record.instructorName,
    eventDate: formatUtcDate(record.eventDate),
    startTime: formatUtcTime(record.startTime),
    endTime: formatUtcTime(record.endTime),
    location: record.location,
    capacity: record.capacity,
    availableSpots,
    registrationCount: record._count.registrations,
    statusId: record.statusId,
    modalityId: record.modalityId,
  };
}

export function mapEventsToListResponse(
  records: EventRawRecord[],
  page: number,
  limit: number,
): EventsListResponse {
  const offset = (page - 1) * limit;

  const data = records.map((record) => {
    // availableSpots es null cuando el evento no tiene límite de capacidad
    const availableSpots =
      record.capacity === null
        ? null
        : Math.max(0, record.capacity - record._count.registrations);

    return mapEventToResponse(record, availableSpots);
  });

  return { data, page, offset };
}
