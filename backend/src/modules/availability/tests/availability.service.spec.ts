import { beforeEach, describe, expect, it, vi } from 'vitest';
import { APPOINTMENT_STATUS_PENDING } from '../constants/appointment-status.constants.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { AvailabilityService } from '../services/availability.service.js';
import { BlockOverlapException } from '../exceptions/index.js';
import type { CreateBlockPayload } from '../types/create-block-payload.types.js';

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
  };
  let service: AvailabilityService;

  beforeEach(() => {
    vi.clearAllMocks();
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
});
