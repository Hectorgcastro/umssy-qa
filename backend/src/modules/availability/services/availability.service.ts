import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { MentorNotFoundException } from '../exceptions/mentor-not-found.exception.js';
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

  async findMentorFreeBlocks(mentorId: string, query: WeekQueryPayload): Promise<AvailabilityBlockResponse[]> {
    const now = new Date();
    // TODO: validar con el servicio de mentores de Epic 6 (#695)
    if (!(await this.availabilityRepository.isActiveMentor(mentorId, now))) {
      throw new MentorNotFoundException();
    }

    const to = new Date(query.to);
    const from = new Date(Math.max(new Date(query.from).getTime(), now.getTime()));
    if (from >= to) {
      return [];
    }

    const blocks = await this.availabilityRepository.findMentorFreeBlocksInRange(mentorId, from, to);
    return this.availabilityMapper.toResponseList(blocks);
  }
}
