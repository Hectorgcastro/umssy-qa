import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APPOINTMENT_STATUS_PENDING } from '../constants/appointment-status.constants.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import {
  BlockHasAppointmentException,
  BlockNotFoundException,
  BlockNotOwnedException,
} from '../exceptions/index.js';
import { AvailabilityService } from '../services/availability.service.js';
<<<<<<< HEAD
import { BlockNotFoundException } from '../exceptions/block-not-found.exception.js';
import { BlockNotOwnedException } from '../exceptions/block-not-owned.exception.js';
import { BlockHasAppointmentException } from '../exceptions/block-has-appointment.exception.js';
import { BlockOverlapException } from '../exceptions/block-overlap.exception.js';
=======
import { BlockOverlapException } from '../exceptions/index.js';
import type { CreateBlockPayload } from '../types/create-block-payload.types.js';
>>>>>>> origin/epic/grupo-7-agendamiento-sesiones

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
<<<<<<< HEAD
  const availabilityRepository = {
    findMentorBlocksInRange: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
=======
  const availabilityRepository = { findMentorBlocksInRange: vi.fn(), create: vi.fn() };
  const mentorId = 'ed9934b9-1a4e-4b8d-bbed-b8772154cba8';
  const payload: CreateBlockPayload = {
    startAt: new Date('2026-11-03T22:00:00.000Z'),
    endAt: new Date('2026-11-04T00:00:00.000Z'),
  };
  const savedBlock = {
    id: 'a3f1c2d4-0000-4000-8000-000000000001',
    mentorId,
    startAt: payload.startAt,
    endAt: payload.endAt,
    seriesId: null,
    repeatUntil: null,
    createdAt: new Date('2026-11-01T12:00:00.000Z'),
    updatedAt: new Date('2026-11-01T12:00:00.000Z'),
>>>>>>> origin/epic/grupo-7-agendamiento-sesiones
  };
  let service: AvailabilityService;

  beforeEach(() => {
    vi.clearAllMocks();
<<<<<<< HEAD
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
=======
    availabilityRepository.findMentorBlocksInRange.mockResolvedValue([]);
    availabilityRepository.create.mockResolvedValue(savedBlock);
    service = new AvailabilityService(availabilityRepository as never, new AvailabilityMapper());
  });

  describe('findMyBlocks', () => {
    it('consulta solo los bloques del mentor en sesión dentro del rango pedido', async () => {
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
      await expect(service.findMyBlocks('mentor-1', QUERY)).resolves.toEqual([]);
    });
  });

  describe('create', () => {
    it('crea el bloque y lo devuelve libre', async () => {
      const result = await service.create(mentorId, payload);

      expect(result).toEqual({
        id: savedBlock.id,
        mentorId,
        startAt: savedBlock.startAt.toISOString(),
        endAt: savedBlock.endAt.toISOString(),
        state: 'free',
        createdAt: savedBlock.createdAt.toISOString(),
        updatedAt: savedBlock.updatedAt.toISOString(),
      });
    });

    it('pasa al repositorio el mentor y las fechas ya convertidas a Date', async () => {
      await service.create(mentorId, payload);

      expect(availabilityRepository.create).toHaveBeenCalledWith(
        mentorId,
        payload.startAt,
        payload.endAt,
      );
      expect(payload.startAt).toBeInstanceOf(Date);
    });

    it.each([
      ['code', { code: '23P01' }],
      ['meta', { meta: { code: '23P01' } }],
      ['message', { message: 'Query failed: conflicting key 23P01' }],
    ])('lanza BlockOverlapException cuando el 23P01 viene en %s', async (_source, errorShape) => {
      availabilityRepository.create.mockRejectedValue(Object.assign(new Error('db'), errorShape));

      await expect(service.create(mentorId, payload)).rejects.toBeInstanceOf(BlockOverlapException);
    });

    it('responde 409 con el mensaje de la historia de usuario', async () => {
      availabilityRepository.create.mockRejectedValue({ code: '23P01' });

      await expect(service.create(mentorId, payload)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Ya tienes un bloque en ese horario',
      });
    });

    it('relanza el error original cuando no es de solapamiento', async () => {
      const databaseError = new Error('connection refused');
      availabilityRepository.create.mockRejectedValue(databaseError);

      await expect(service.create(mentorId, payload)).rejects.toBe(databaseError);
    });
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
>>>>>>> origin/epic/grupo-7-agendamiento-sesiones
    });
  });
});
