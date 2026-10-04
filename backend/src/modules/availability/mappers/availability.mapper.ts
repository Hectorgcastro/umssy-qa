import { Injectable } from '@nestjs/common';
import type { AvailabilityBlock } from '../../../prisma/client.js';
import type { AvailabilityBlockResponse } from '../types/availability.types.js';

@Injectable()
export class AvailabilityMapper {
  // un bloque recien creado no tiene citas, por eso nace libre.
  toResponse(block: AvailabilityBlock): AvailabilityBlockResponse {
    return {
      id: block.id,
      mentorId: block.mentorId,
      startAt: block.startAt,
      endAt: block.endAt,
      state: 'free',
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
    };
  }
}
