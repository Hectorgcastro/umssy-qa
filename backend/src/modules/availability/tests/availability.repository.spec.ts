import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ACTIVE_APPOINTMENT_STATUSES } from '../constants/appointment-status.constants.js';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import { AvailabilityRepository } from '../repositories/availability.repository.js';

describe('AvailabilityRepository', () => {
  const findMany = vi.fn();
  const count = vi.fn();
  const prisma = { availabilityBlock: { findMany }, user: { count } };
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

  it('busca solo los bloques sin cita pendiente ni confirmada dentro del rango', async () => {
    const from = new Date('2026-10-05T04:00:00.000Z');
    const to = new Date('2026-10-12T04:00:00.000Z');
    findMany.mockResolvedValue([]);

    await repository.findMentorFreeBlocksInRange('mentor-1', from, to);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        mentorId: 'mentor-1',
        startAt: { gte: from, lt: to },
        appointments: { none: { status: { title: { in: ACTIVE_APPOINTMENT_STATUSES } } } },
      },
      orderBy: { startAt: 'asc' },
      include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
    });
  });

  it('considera mentor activo solo a un usuario activo con rol mentor vigente', async () => {
    const now = new Date('2026-10-04T12:00:00.000Z');
    count.mockResolvedValue(1);

    await expect(repository.isActiveMentor('mentor-1', now)).resolves.toBe(true);
    expect(count).toHaveBeenCalledWith({
      where: {
        id: 'mentor-1',
        isActive: true,
        roles: { some: { deletedAt: null, startAt: { lte: now }, role: { name: 'mentor' } } },
      },
    });
  });

  it('devuelve false si no encuentra un mentor activo', async () => {
    count.mockResolvedValue(0);

    await expect(repository.isActiveMentor('mentor-1', new Date())).resolves.toBe(false);
  });
});
