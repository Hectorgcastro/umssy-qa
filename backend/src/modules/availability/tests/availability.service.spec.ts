import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APPOINTMENT_STATUS_PENDING } from '../constants/appointment-status.constants.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { AvailabilityService } from '../services/availability.service.js';
import { BlockNotFoundException } from '../exceptions/block-not-found.exception.js';
import { BlockNotOwnedException } from '../exceptions/block-not-owned.exception.js';
import { BlockHasAppointmentException } from '../exceptions/block-has-appointment.exception.js';
import { BlockOverlapException } from '../exceptions/block-overlap.exception.js';

const QUERY = { from: '2026-10-05T04:00:00.000Z', to: '2026-10-12T03:59:59.999Z' };

const UPDATE_PAYLOAD = {
  startAt: '2026-10-10T14:00:00.000Z',
  endAt: '2026-10-10T14:30:00.000Z',
};

const block = (id: string, statuses: string[] = [], mentorId = 'mentor-1') => ({
  id,
  mentorId,
  startAt: new Date('2026-10-06T22:00:00.000Z'),
  endAt: new Date('2026-10-06T22:30:00.000Z'),
  seriesId: null,
  repeatUntil: null,
  createdAt: new Date('2026-10-01T12:00:00.000Z'),
  updatedAt: new Date('2026-10-01T12:00:00.000Z'),
  appointments: statuses.map((title) => ({ status: { title } })),
});

describe('AvailabilityService', () => {
  const availabilityRepository = {
    findMentorBlocksInRange: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
  };
  let service: AvailabilityService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AvailabilityService(availabilityRepository as any, new AvailabilityMapper());
  });

  describe('findMyBlocks', () => {
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
  });

  describe('updateBlock', () => {
    it('responde 404 si el bloque no existe', async () => {
      availabilityRepository.findById.mockResolvedValue(null);

      await expect(service.updateBlock('mentor-1', 'block-1', UPDATE_PAYLOAD)).rejects.toThrow(
        BlockNotFoundException,
      );
      expect(availabilityRepository.update).not.toHaveBeenCalled();
    });

    it('responde 403 y no toca nada si el bloque es de otro mentor', async () => {
      availabilityRepository.findById.mockResolvedValue(block('block-1', [], 'otro-mentor'));

      await expect(service.updateBlock('mentor-1', 'block-1', UPDATE_PAYLOAD)).rejects.toThrow(
        BlockNotOwnedException,
      );
      expect(availabilityRepository.update).not.toHaveBeenCalled();
    });

    it('responde 409 si el bloque tiene una cita pendiente o confirmada', async () => {
      availabilityRepository.findById.mockResolvedValue(block('block-1', [APPOINTMENT_STATUS_PENDING]));

      await expect(service.updateBlock('mentor-1', 'block-1', UPDATE_PAYLOAD)).rejects.toThrow(
        BlockHasAppointmentException,
      );
      expect(availabilityRepository.update).not.toHaveBeenCalled();
    });

    it('actualiza un bloque propio sin citas y devuelve el bloque mapeado', async () => {
      availabilityRepository.findById.mockResolvedValue(block('block-1'));
      availabilityRepository.update.mockResolvedValue(
        block('block-1', [], 'mentor-1'),
      );

      const result = await service.updateBlock('mentor-1', 'block-1', UPDATE_PAYLOAD);

      expect(availabilityRepository.update).toHaveBeenCalledWith('block-1', {
        startAt: new Date(UPDATE_PAYLOAD.startAt),
        endAt: new Date(UPDATE_PAYLOAD.endAt),
      });
      expect(result.id).toBe('block-1');
      expect(result.state).toBe('free');
    });

    it('propaga BlockOverlapException si el repository la lanza al guardar', async () => {
      availabilityRepository.findById.mockResolvedValue(block('block-1'));
      availabilityRepository.update.mockRejectedValue(new BlockOverlapException());

      await expect(service.updateBlock('mentor-1', 'block-1', UPDATE_PAYLOAD)).rejects.toThrow(
        BlockOverlapException,
      );
    });
  });
});
