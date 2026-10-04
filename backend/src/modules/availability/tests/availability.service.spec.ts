import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APPOINTMENT_STATUS_PENDING } from '../constants/appointment-status.constants.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import {
  BlockHasAppointmentException,
  BlockNotFoundException,
  BlockNotOwnedException,
} from '../exceptions/index.js';
import { AvailabilityService } from '../services/availability.service.js';

const QUERY = { from: '2026-10-05T04:00:00.000Z', to: '2026-10-12T03:59:59.999Z' };

const block = (id: string, statuses: string[] = []) => ({
  id,
  mentorId: 'mentor-1',
  startAt: new Date('2026-10-06T22:00:00.000Z'),
  endAt: new Date('2026-10-06T22:30:00.000Z'),
  seriesId: null,
  repeatUntil: null,
  createdAt: new Date('2026-10-01T12:00:00.000Z'),
  updatedAt: new Date('2026-10-01T12:00:00.000Z'),
  appointments: statuses.map((title) => ({ status: { title } })),
});

describe('AvailabilityService', () => {
  const availabilityRepository = { findMentorBlocksInRange: vi.fn() };
  let service: AvailabilityService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AvailabilityService(availabilityRepository as any, new AvailabilityMapper());
  });

  it('consulta solo los bloques del mentor en sesión dentro del rango pedido', async () => {
    availabilityRepository.findMentorBlocksInRange.mockResolvedValue([]);

    await service.findMyBlocks('mentor-1', QUERY);

    expect(availabilityRepository.findMentorBlocksInRange).toHaveBeenCalledWith(
      'mentor-1',
      new Date(QUERY.from),
      new Date(QUERY.to),
    );
  });

  it('devuelve los bloques mapeados con su estado', async () => {
    availabilityRepository.findMentorBlocksInRange.mockResolvedValue([
      block('block-1'),
      block('block-2', [APPOINTMENT_STATUS_PENDING]),
    ]);

    const result = await service.findMyBlocks('mentor-1', QUERY);

    expect(result.map((item) => [item.id, item.state])).toEqual([
      ['block-1', 'free'],
      ['block-2', 'pending'],
    ]);
  });

  it('devuelve una lista vacía si el mentor no tiene bloques en la semana', async () => {
    availabilityRepository.findMentorBlocksInRange.mockResolvedValue([]);

    await expect(service.findMyBlocks('mentor-1', QUERY)).resolves.toEqual([]);
  });

  describe('remove', () => {
    const repository = { findById: vi.fn(), delete: vi.fn() };
    let service: AvailabilityService;

    beforeEach(() => {
      vi.clearAllMocks();
      service = new AvailabilityService(repository as never, new AvailabilityMapper());
    });

    it('lanza 404 si el bloque no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('mentor-1', 'block-x')).rejects.toThrow(BlockNotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('lanza 403 si el bloque pertenece a otro mentor', async () => {
      repository.findById.mockResolvedValue(block('block-x'));

      await expect(service.remove('otro-mentor', 'block-x')).rejects.toThrow(BlockNotOwnedException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('lanza 409 si el bloque tiene citas activas', async () => {
      repository.findById.mockResolvedValue(block('block-x', [APPOINTMENT_STATUS_PENDING]));

      await expect(service.remove('mentor-1', 'block-x')).rejects.toThrow(BlockHasAppointmentException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('elimina el bloque y devuelve su id', async () => {
      const target = block('block-x');
      repository.findById.mockResolvedValue(target);
      repository.delete.mockResolvedValue(target);

      await expect(service.remove('mentor-1', 'block-x')).resolves.toEqual({ id: 'block-x' });
      expect(repository.delete).toHaveBeenCalledWith('block-x');
    });
  });
});
