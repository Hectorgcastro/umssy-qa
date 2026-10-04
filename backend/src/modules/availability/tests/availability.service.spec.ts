import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APPOINTMENT_STATUS_PENDING } from '../constants/appointment-status.constants.js';
import { MentorNotFoundException } from '../exceptions/mentor-not-found.exception.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
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
  const availabilityRepository = {
    findMentorBlocksInRange: vi.fn(),
    findMentorFreeBlocksInRange: vi.fn(),
    isActiveMentor: vi.fn(),
  };
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

  describe('findMentorFreeBlocks', () => {
    beforeEach(() => {
      availabilityRepository.isActiveMentor.mockResolvedValue(true);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('responde 404 sin consultar bloques si el mentor no existe o no está activo', async () => {
      const now = new Date('2026-10-01T12:00:00.000Z');
      vi.useFakeTimers({ now });
      availabilityRepository.isActiveMentor.mockResolvedValue(false);

      await expect(service.findMentorFreeBlocks('mentor-1', QUERY)).rejects.toBeInstanceOf(
        MentorNotFoundException,
      );
      expect(availabilityRepository.isActiveMentor).toHaveBeenCalledWith('mentor-1', now);
      expect(availabilityRepository.findMentorFreeBlocksInRange).not.toHaveBeenCalled();
    });

    it('consulta desde el inicio del rango cuando todavía no empezó', async () => {
      vi.useFakeTimers({ now: new Date('2026-10-01T12:00:00.000Z') });
      availabilityRepository.findMentorFreeBlocksInRange.mockResolvedValue([]);

      await service.findMentorFreeBlocks('mentor-1', QUERY);

      expect(availabilityRepository.findMentorFreeBlocksInRange).toHaveBeenCalledWith(
        'mentor-1',
        new Date(QUERY.from),
        new Date(QUERY.to),
      );
    });

    it('consulta desde ahora para no devolver bloques pasados', async () => {
      const now = new Date('2026-10-07T15:30:00.000Z');
      vi.useFakeTimers({ now });
      availabilityRepository.findMentorFreeBlocksInRange.mockResolvedValue([]);

      await service.findMentorFreeBlocks('mentor-1', QUERY);

      expect(availabilityRepository.findMentorFreeBlocksInRange).toHaveBeenCalledWith(
        'mentor-1',
        now,
        new Date(QUERY.to),
      );
    });

    it('devuelve una lista vacía sin consultar si todo el rango ya pasó', async () => {
      vi.useFakeTimers({ now: new Date('2026-10-20T12:00:00.000Z') });

      await expect(service.findMentorFreeBlocks('mentor-1', QUERY)).resolves.toEqual([]);
      expect(availabilityRepository.findMentorFreeBlocksInRange).not.toHaveBeenCalled();
    });

    it('devuelve los bloques libres mapeados sin datos de citas', async () => {
      vi.useFakeTimers({ now: new Date('2026-10-01T12:00:00.000Z') });
      availabilityRepository.findMentorFreeBlocksInRange.mockResolvedValue([block('block-1')]);

      const [result] = await service.findMentorFreeBlocks('mentor-1', QUERY);

      expect(result.state).toBe('free');
      expect(result).not.toHaveProperty('appointments');
    });
  });
});
