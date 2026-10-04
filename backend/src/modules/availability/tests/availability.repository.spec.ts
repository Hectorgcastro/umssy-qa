import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import { AvailabilityRepository } from '../repositories/availability.repository.js';

describe('AvailabilityRepository', () => {
  const findMany = vi.fn();
  const findUnique = vi.fn();
  const deleteBlock = vi.fn();
  const prisma = { availabilityBlock: { findMany, findUnique, delete: deleteBlock } };
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

  it('busca un bloque por id incluyendo solo sus citas activas', async () => {
    findUnique.mockResolvedValue(null);

    await repository.findById('block-1');

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'block-1' },
      include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
    });
  });

  it('devuelve null si el bloque no existe', async () => {
    findUnique.mockResolvedValue(null);

    await expect(repository.findById('missing')).resolves.toBeNull();
  });

  it('borra el bloque por id', async () => {
    const row = { id: 'block-1' };
    deleteBlock.mockResolvedValue(row);

    await expect(repository.delete('block-1')).resolves.toBe(row);
    expect(deleteBlock).toHaveBeenCalledWith({ where: { id: 'block-1' } });
  });
});
