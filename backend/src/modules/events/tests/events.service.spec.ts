import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EventsService } from '../services/events.service.js';
import { EventsInvalidDateRangeException } from '../exceptions/events-invalid-date-range.exception.js';
import type { EventRawRecord } from '../types/events.types.js';

function buildRecord(): EventRawRecord {
  return {
    id: 'uuid-1',
    title: 'Evento',
    description: null,
    categoryId: 'cat-1',
    instructorName: null,
    eventDate: new Date('2026-06-15T00:00:00.000Z'),
    startTime: new Date('1970-01-01T10:00:00.000Z'),
    endTime: new Date('1970-01-01T12:00:00.000Z'),
    location: null,
    capacity: 10,
    statusId: 'status-1',
    modalityId: 'modality-1',
    category: { id: 'cat-1', name: 'Tecnologia' },
    _count: { registrations: 3 },
  };
}

describe('EventsService', () => {
  let service: EventsService;
  let repositoryMock: { findMany: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repositoryMock = { findMany: vi.fn() };
    service = new EventsService(repositoryMock as never);
  });

  it('retorna la lista formateada cuando los parametros son validos', async () => {
    repositoryMock.findMany.mockResolvedValue([buildRecord()]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
    expect(result.data[0].availableSpots).toBe(7);
  });

  it('lanza EventsInvalidDateRangeException cuando from > to', async () => {
    await expect(
      service.findAll({ page: 1, limit: 10, from: '2026-12-31', to: '2026-01-01' }),
    ).rejects.toThrow(EventsInvalidDateRangeException);
  });

  it('no lanza cuando from === to', async () => {
    repositoryMock.findMany.mockResolvedValue([]);
    await expect(
      service.findAll({ page: 1, limit: 10, from: '2026-06-01', to: '2026-06-01' }),
    ).resolves.not.toThrow();
  });

  it('pasa categoryId al repositorio cuando se provee', async () => {
    repositoryMock.findMany.mockResolvedValue([]);
    await service.findAll({ page: 1, limit: 10, categoryId: 'cat-uuid' });
    expect(repositoryMock.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'cat-uuid' }),
    );
  });

  it('calcula offset correcto en pagina 3 con limit 5', async () => {
    repositoryMock.findMany.mockResolvedValue([]);
    const result = await service.findAll({ page: 3, limit: 5 });
    expect(result.offset).toBe(10);
  });
});
