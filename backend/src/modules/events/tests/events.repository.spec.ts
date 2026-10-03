import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EventsRepository } from '../repositories/events.repository.js';

describe('EventsRepository', () => {
  let repository: EventsRepository;
  let prismaMock: { event: { findMany: ReturnType<typeof vi.fn> } };

  beforeEach(() => {
    prismaMock = {
      event: { findMany: vi.fn().mockResolvedValue([]) },
    };
    repository = new EventsRepository(prismaMock as never);
  });

  it('llama a findMany con skip y take correctos para pagina 2 limit 5', async () => {
    await repository.findMany({ page: 2, limit: 5 });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 }),
    );
  });

  it('incluye filtro categoryId en el where cuando se provee', async () => {
    await repository.findMany({ page: 1, limit: 10, categoryId: 'cat-abc' });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ categoryId: 'cat-abc' }),
      }),
    );
  });

  it('incluye filtro statusId en el where cuando se provee', async () => {
    await repository.findMany({ page: 1, limit: 10, statusId: 'status-abc' });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ statusId: 'status-abc' }),
      }),
    );
  });

  it('incluye filtro de rango de fechas cuando from y to estan presentes', async () => {
    await repository.findMany({ page: 1, limit: 10, from: '2026-01-01', to: '2026-12-31' });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          eventDate: expect.objectContaining({
            gte: new Date('2026-01-01'),
            lte: new Date('2026-12-31'),
          }),
        }),
      }),
    );
  });

  it('ordena por eventDate asc y startTime asc', async () => {
    await repository.findMany({ page: 1, limit: 10 });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
      }),
    );
  });
});
