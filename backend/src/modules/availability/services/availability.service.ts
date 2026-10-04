import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { OVERLAP_ERROR_CODE } from '../constants/create-block.constants.js';
import { BlockOverlapException } from '../exceptions/index.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { CreateBlockPayload } from '../types/create-block-payload.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';

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

  async findMyBlocks(
    mentorId: string,
    query: WeekQueryPayload,
  ): Promise<AvailabilityBlockResponse[]> {
    const blocks = await this.availabilityRepository.findMentorBlocksInRange(
      mentorId,
      new Date(query.from),
      new Date(query.to),
    );
    return this.availabilityMapper.toResponseList(blocks);
  }

  async create(mentorId: string, payload: CreateBlockPayload): Promise<AvailabilityBlockResponse> {
    try {
      const block = await this.availabilityRepository.create(
        mentorId,
        payload.startAt,
        payload.endAt,
      );
      // un bloque recien creado no tiene citas: nace libre.
      return this.availabilityMapper.toResponse({ ...block, appointments: [] });
    } catch (error) {
      if (hasOverlapErrorCode(error)) {
        throw new BlockOverlapException();
      }
      throw error;
    }
  }
}
