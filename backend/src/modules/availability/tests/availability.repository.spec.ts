import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import { AvailabilityRepository } from '../repositories/availability.repository.js';

describe('AvailabilityRepository', () => {
  const findMany = vi.fn();
  const prisma = { availabilityBlock: { findMany } };
  let repository: AvailabilityRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AvailabilityRepository(prisma as any);
  });

  it('busca los bloques del mentor dentro del rango, ordenados e incluyendo solo citas activas', async () => {
    const from = new Date('2026-10-05T04:00:00.000Z');
    const to = new Date('2026-10-12T04:00:00.000Z');
    findMany.mockResolvedValue([]);

    await repository.findMentorBlocksInRange('mentor-1', from, to);

    expect(findMany).toHaveBeenCalledWith({
      where: { mentorId: 'mentor-1', startAt: { gte: from, lt: to } },
      orderBy: { startAt: 'asc' },
      include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
    });
  });

  it('devuelve lo que entrega Prisma', async () => {
    const rows = [{ id: 'block-1' }];
    findMany.mockResolvedValue(rows);

    await expect(repository.findMentorBlocksInRange('mentor-1', new Date(), new Date())).resolves.toBe(rows);
  });
});
