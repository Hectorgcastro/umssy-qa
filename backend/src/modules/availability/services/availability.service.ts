import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { BlockOverlapException } from '../exceptions/index.js';
import type { CreateBlockPayload } from '../requests/create-block.request.js';
import type { AvailabilityBlockResponse } from '../types/availability.types.js';

// prisma no tiene codigo propio para la restriccion exclude: el 23p01 llega dentro del error.
const OVERLAP_ERROR_CODE = '23P01';

const hasOverlapErrorCode = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { code?: unknown; meta?: unknown; message?: unknown };

  if (candidate.code === OVERLAP_ERROR_CODE) {
    return true;
  }

  if (typeof candidate.meta === 'object' && candidate.meta !== null) {
    const meta = candidate.meta as { code?: unknown };
    if (meta.code === OVERLAP_ERROR_CODE) {
      return true;
    }
  }

  return typeof candidate.message === 'string' && candidate.message.includes(OVERLAP_ERROR_CODE);
};

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly availabilityMapper: AvailabilityMapper,
  ) {}

  async create(mentorId: string, payload: CreateBlockPayload): Promise<AvailabilityBlockResponse> {
    const startAt = new Date(payload.startAt);
    const endAt = new Date(payload.endAt);

    try {
      const block = await this.availabilityRepository.create(mentorId, startAt, endAt);
      return this.availabilityMapper.toResponse(block);
    } catch (error) {
      if (hasOverlapErrorCode(error)) {
        throw new BlockOverlapException();
      }
      throw error;
    }
  }
}
