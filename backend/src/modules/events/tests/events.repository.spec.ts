import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EventsRepository } from '../repositories/events.repository.js';

describe('EventsRepository', () => {
  let repository: EventsRepository;
  let prismaMock: {
    event: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
    $transaction: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    prismaMock = {
      event: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
      $transaction: vi.fn().mockImplementation((promises) => Promise.all(promises)),
    };
    repository = new EventsRepository(prismaMock as never);
  });

  it('llama a findMany y count dentro de $transaction con skip y take correctos', async () => {
    prismaMock.event.findMany.mockResolvedValue([]);
    prismaMock.event.count.mockResolvedValue(0);

    const result = await repository.findAndCount({ skip: 10, take: 5 });

    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 5 }),
    );
    expect(prismaMock.event.count).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('aplica filtro categoryId en el where de findMany y count', async () => {
    prismaMock.event.findMany.mockResolvedValue([]);
    prismaMock.event.count.mockResolvedValue(0);

    await repository.findAndCount({ categoryId: 'cat-abc', skip: 0, take: 10 });

    const expectedWhere = { categoryId: 'cat-abc' };
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(prismaMock.event.count).toHaveBeenCalledWith({ where: expectedWhere });
  });

  it('aplica filtro statusId en el where de findMany y count', async () => {
    prismaMock.event.findMany.mockResolvedValue([]);
    prismaMock.event.count.mockResolvedValue(0);

    await repository.findAndCount({ statusId: 'status-abc', skip: 0, take: 10 });

    const expectedWhere = { statusId: 'status-abc' };
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(prismaMock.event.count).toHaveBeenCalledWith({ where: expectedWhere });
  });

  it('aplica ambos filtros (categoryId y statusId) cuando se proveen', async () => {
    prismaMock.event.findMany.mockResolvedValue([]);
    prismaMock.event.count.mockResolvedValue(0);

    await repository.findAndCount({ categoryId: 'cat-abc', statusId: 'status-abc', skip: 0, take: 10 });

    const expectedWhere = { categoryId: 'cat-abc', statusId: 'status-abc' };
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(prismaMock.event.count).toHaveBeenCalledWith({ where: expectedWhere });
  });

  it('ordena por eventDate asc y startTime asc', async () => {
    prismaMock.event.findMany.mockResolvedValue([]);
    prismaMock.event.count.mockResolvedValue(0);

    await repository.findAndCount({ skip: 0, take: 10 });

    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
      }),
    );
  });
});
