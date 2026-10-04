import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly availabilityMapper: AvailabilityMapper,
  ) {}

  async findMyBlocks(mentorId: string, query: WeekQueryPayload): Promise<AvailabilityBlockResponse[]> {
    const blocks = await this.availabilityRepository.findMentorBlocksInRange(
      mentorId,
      new Date(query.from),
      new Date(query.to),
    );
    return this.availabilityMapper.toResponseList(blocks);
  }
}
