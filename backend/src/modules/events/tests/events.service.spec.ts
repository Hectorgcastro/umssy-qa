import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EventsService } from '../services/events.service.js';
import type { EventWithRelations } from '../types/events.types.js';

function buildRecord(): EventWithRelations {
  return {
    id: 'uuid-1',
    title: 'Evento',
    description: null,
    eventDate: new Date('2026-06-15T00:00:00.000Z'),
    startTime: new Date('1970-01-01T10:00:00.000Z'),
    endTime: new Date('1970-01-01T12:00:00.000Z'),
    location: null,
    capacity: 10,
    statusId: 'status-1',
    category: { id: 'cat-1', name: 'Tecnologia' },
    _count: { registrations: 3 },
  };
}

describe('EventsService', () => {
  let service: EventsService;
  let repositoryMock: { findAndCount: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repositoryMock = { findAndCount: vi.fn() };
    service = new EventsService(repositoryMock as never);
  });

  it('retorna la lista formateada con offset, totalPages e items', async () => {
    repositoryMock.findAndCount.mockResolvedValue({
      items: [buildRecord()],
      total: 1,
    });

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data.items).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
    expect(result.data.total).toBe(1);
    expect(result.data.totalPages).toBe(1);
    expect(result.data.items[0].availableSpots).toBe(7);
    expect(result.data.items[0].registeredCount).toBe(3);
  });

  it('calcula totalPages como 0 cuando total es 0', async () => {
    repositoryMock.findAndCount.mockResolvedValue({
      items: [],
      total: 0,
    });

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data.items).toHaveLength(0);
    expect(result.data.total).toBe(0);
    expect(result.data.totalPages).toBe(0);
  });

  it('pasa categoryId, statusId, skip y take al repositorio', async () => {
    repositoryMock.findAndCount.mockResolvedValue({ items: [], total: 0 });

    await service.findAll({ page: 3, limit: 5, categoryId: 'cat-uuid', statusId: 'status-uuid' });

    expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
      categoryId: 'cat-uuid',
      statusId: 'status-uuid',
      skip: 10,
      take: 5,
    });
  });
});
