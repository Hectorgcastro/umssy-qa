import { describe, expect, it } from 'vitest';
import {
  formatUtcDate,
  formatUtcTime,
  mapEventToResponse,
  mapEventsToListResponse,
} from '../mappers/events.mapper.js';
import type { EventRawRecord } from '../types/events.types.js';

function buildRecord(overrides: Partial<EventRawRecord> = {}): EventRawRecord {
  return {
    id: 'uuid-1',
    title: 'Evento de prueba',
    description: 'Descripcion',
    categoryId: 'cat-uuid',
    instructorName: 'Juan Perez',
    eventDate: new Date('2026-06-15T00:00:00.000Z'),
    startTime: new Date('1970-01-01T09:00:00.000Z'),
    endTime: new Date('1970-01-01T11:30:00.000Z'),
    location: 'Sala A',
    capacity: 20,
    statusId: 'status-uuid',
    modalityId: 'modality-uuid',
    category: { id: 'cat-uuid', name: 'Tecnologia' },
    _count: { registrations: 5 },
    ...overrides,
  };
}

describe('formatUtcDate', () => {
  it('formatea una fecha UTC como YYYY-MM-DD', () => {
    expect(formatUtcDate(new Date('2026-06-15T00:00:00.000Z'))).toBe('2026-06-15');
  });

  it('rellena con ceros el mes y dia', () => {
    expect(formatUtcDate(new Date('2026-01-03T00:00:00.000Z'))).toBe('2026-01-03');
  });
});

describe('formatUtcTime', () => {
  it('formatea hora UTC como HH:mm', () => {
    expect(formatUtcTime(new Date('1970-01-01T09:05:00.000Z'))).toBe('09:05');
  });

  it('maneja medianoche correctamente', () => {
    expect(formatUtcTime(new Date('1970-01-01T00:00:00.000Z'))).toBe('00:00');
  });
});

describe('mapEventToResponse', () => {
  it('mapea un registro al formato de respuesta', () => {
    const record = buildRecord();
    const result = mapEventToResponse(record, 15);

    expect(result).toEqual({
      id: 'uuid-1',
      title: 'Evento de prueba',
      description: 'Descripcion',
      category: { id: 'cat-uuid', name: 'Tecnologia' },
      instructorName: 'Juan Perez',
      eventDate: '2026-06-15',
      startTime: '09:00',
      endTime: '11:30',
      location: 'Sala A',
      capacity: 20,
      availableSpots: 15,
      registrationCount: 5,
      statusId: 'status-uuid',
      modalityId: 'modality-uuid',
    });
  });

  it('acepta availableSpots null cuando capacity es null', () => {
    const record = buildRecord({ capacity: null });
    const result = mapEventToResponse(record, null);
    expect(result.availableSpots).toBeNull();
    expect(result.capacity).toBeNull();
  });
});

describe('mapEventsToListResponse', () => {
  it('calcula offset como (page - 1) * limit', () => {
    const records = [buildRecord()];
    const result = mapEventsToListResponse(records, 3, 10);
    expect(result.offset).toBe(20);
    expect(result.page).toBe(3);
  });

  it('calcula availableSpots correctamente', () => {
    const record = buildRecord({ capacity: 20, _count: { registrations: 5 } });
    const result = mapEventsToListResponse([record], 1, 10);
    expect(result.data[0].availableSpots).toBe(15);
  });

  it('pone availableSpots en 0 cuando capacity esta llena', () => {
    const record = buildRecord({ capacity: 5, _count: { registrations: 5 } });
    const result = mapEventsToListResponse([record], 1, 10);
    expect(result.data[0].availableSpots).toBe(0);
  });

  it('pone availableSpots null cuando capacity es null', () => {
    const record = buildRecord({ capacity: null, _count: { registrations: 3 } });
    const result = mapEventsToListResponse([record], 1, 10);
    expect(result.data[0].availableSpots).toBeNull();
  });

  it('devuelve lista vacia cuando no hay registros', () => {
    const result = mapEventsToListResponse([], 1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.offset).toBe(0);
  });
});
