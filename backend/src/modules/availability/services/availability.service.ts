import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import { BlockNotFoundException } from '../exceptions/block-not-found.exception.js';
import { BlockNotOwnedException } from '../exceptions/block-not-owned.exception.js';
import { BlockHasAppointmentException } from '../exceptions/block-has-appointment.exception.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { UpdateBlockPayload } from '../requests/update-block.request.js';
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

  async updateBlock(
    mentorId: string,
    blockId: string,
    payload: UpdateBlockPayload,
  ): Promise<AvailabilityBlockResponse> {
    const block = await this.availabilityRepository.findById(blockId);

    if (!block) {
      throw new BlockNotFoundException();
    }
    if (block.mentorId !== mentorId) {
      throw new BlockNotOwnedException();
    }
    if (block.appointments.length > 0) {
      throw new BlockHasAppointmentException();
    }

    const updated = await this.availabilityRepository.update(blockId, {
      startAt: new Date(payload.startAt),
      endAt: new Date(payload.endAt),
    });

    return this.availabilityMapper.toResponse(updated);
  }
}
