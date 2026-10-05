import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository.js';
import { AvailabilityMapper } from '../mappers/availability.mapper.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { WeekQueryPayload } from '../types/week-query-payload.types.js';
import {
  BlockHasAppointmentException,
  BlockNotFoundException,
  BlockNotOwnedException,
} from '../exceptions/index.js';
import type { DeletedBlockResponse } from '../types/deleted-block-response.types.js';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly availabilityMapper: AvailabilityMapper,
  ) {}

  async remove(mentorId: string, blockId: string): Promise<DeletedBlockResponse> {
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
    // TODO: impedir eliminar el bloque si tiene propuestas activas (Sprint 2)
    await this.availabilityRepository.delete(blockId);
    return this.availabilityMapper.toDeletedResponse(block);
  }

  async findMyBlocks(mentorId: string, query: WeekQueryPayload): Promise<AvailabilityBlockResponse[]> {
    const blocks = await this.availabilityRepository.findMentorBlocksInRange(
      mentorId,
      new Date(query.from),
      new Date(query.to),
    );
    return this.availabilityMapper.toResponseList(blocks);
  }
}
