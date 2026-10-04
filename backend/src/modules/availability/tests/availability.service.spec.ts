import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AvailabilityService } from '../services/availability.service.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { BlockOverlapException } from '../exceptions/index.js';
import type { CreateBlockPayload } from '../requests/availability.schema.js';

describe('AvailabilityService', () => {
  const availabilityRepository = { create: vi.fn() };
  const availabilityMapper = new AvailabilityMapper();
  const mentorId = 'ed9934b9-1a4e-4b8d-bbed-b8772154cba8';
  const payload: CreateBlockPayload = {
    startAt: '2026-11-03T22:00:00.000Z',
    endAt: '2026-11-04T00:00:00.000Z',
  };
  const savedBlock = {
    id: 'a3f1c2d4-0000-4000-8000-000000000001',
    mentorId,
    startAt: new Date(payload.startAt),
    endAt: new Date(payload.endAt),
    seriesId: null,
    repeatUntil: null,
    createdAt: new Date('2026-11-01T12:00:00.000Z'),
    updatedAt: new Date('2026-11-01T12:00:00.000Z'),
  };
  let service: AvailabilityService;

  beforeEach(() => {
    vi.clearAllMocks();
    availabilityRepository.create.mockResolvedValue(savedBlock);
    service = new AvailabilityService(availabilityRepository as never, availabilityMapper);
  });

  it('crea el bloque y lo devuelve libre', async () => {
    const result = await service.create(mentorId, payload);

    expect(result).toEqual({
      id: savedBlock.id,
      mentorId,
      startAt: savedBlock.startAt,
      endAt: savedBlock.endAt,
      state: 'free',
      createdAt: savedBlock.createdAt,
      updatedAt: savedBlock.updatedAt,
    });
  });

  it('pasa al repositorio el mentor y las fechas convertidas a Date', async () => {
    await service.create(mentorId, payload);

    expect(availabilityRepository.create).toHaveBeenCalledWith(
      mentorId,
      new Date(payload.startAt),
      new Date(payload.endAt),
    );
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
