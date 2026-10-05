import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '../../../prisma/client.js';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import { BlockOverlapException } from '../exceptions/block-overlap.exception.js';
import { AvailabilityRepository } from '../repositories/availability.repository.js';

function makeOverlapError(): Prisma.PrismaClientKnownRequestError {
  const error = Object.create(Prisma.PrismaClientKnownRequestError.prototype);
  error.code = 'P2039';
  error.meta = { driverAdapterError: { cause: { code: '23P01' } } };
  return error;
}

describe('AvailabilityRepository', () => {
  const findMany = vi.fn();
  const findUnique = vi.fn();
<<<<<<< HEAD
  const update = vi.fn();
  const prisma = { availabilityBlock: { findMany, findUnique, update } };
=======
  const deleteBlock = vi.fn();
  const prisma = { availabilityBlock: { findMany, findUnique, delete: deleteBlock } };
>>>>>>> origin/epic/grupo-7-agendamiento-sesiones
  let repository: AvailabilityRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AvailabilityRepository(prisma as any);
  });

  describe('findMentorBlocksInRange', () => {
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

  describe('findById', () => {
    it('busca por id incluyendo solo citas activas', async () => {
      findUnique.mockResolvedValue(null);

      await repository.findById('block-1');

      expect(findUnique).toHaveBeenCalledWith({
        where: { id: 'block-1' },
        include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
      });
    });

    it('devuelve null si no existe', async () => {
      findUnique.mockResolvedValue(null);

      await expect(repository.findById('block-1')).resolves.toBeNull();
    });

    it('devuelve el bloque que entrega Prisma', async () => {
      const row = { id: 'block-1' };
      findUnique.mockResolvedValue(row);

      await expect(repository.findById('block-1')).resolves.toBe(row);
    });
  });

  describe('update', () => {
    const data = { startAt: new Date('2026-10-10T14:00:00Z'), endAt: new Date('2026-10-10T14:30:00Z') };

    it('actualiza el bloque incluyendo solo citas activas', async () => {
      const updated = { id: 'block-1', ...data };
      update.mockResolvedValue(updated);

      await expect(repository.update('block-1', data)).resolves.toBe(updated);
      expect(update).toHaveBeenCalledWith({
        where: { id: 'block-1' },
        data,
        include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
      });
    });

    it('traduce la violacion de la constraint de no-solape (P2039 / 23P01) a BlockOverlapException', async () => {
      update.mockRejectedValue(makeOverlapError());

      await expect(repository.update('block-1', data)).rejects.toThrow(BlockOverlapException);
    });

    it('relanza cualquier otro error de Prisma tal cual', async () => {
      const other = Object.create(Prisma.PrismaClientKnownRequestError.prototype);
      other.code = 'P2025';
      other.meta = {};
      update.mockRejectedValue(other);

      await expect(repository.update('block-1', data)).rejects.toBe(other);
    });

    it('relanza errores que no son de Prisma tal cual', async () => {
      const generic = new Error('conexion perdida');
      update.mockRejectedValue(generic);

      await expect(repository.update('block-1', data)).rejects.toBe(generic);
    });
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
