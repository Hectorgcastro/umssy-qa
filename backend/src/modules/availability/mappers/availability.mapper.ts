import { Injectable } from '@nestjs/common';
import {
  APPOINTMENT_STATUS_CONFIRMED,
  APPOINTMENT_STATUS_PENDING,
} from '../constants/appointment-status.constants.js';
import type { AvailabilityBlockResponse } from '../types/availability-block-response.types.js';
import type { AvailabilityBlockState } from '../types/availability-block-state.types.js';
import type { AvailabilityBlockWithAppointments } from '../types/availability-block-with-appointments.types.js';

@Injectable()
export class AvailabilityMapper {
  toResponse(block: AvailabilityBlockWithAppointments): AvailabilityBlockResponse {
    return {
      id: block.id,
      mentorId: block.mentorId,
      startAt: block.startAt.toISOString(),
      endAt: block.endAt.toISOString(),
      state: this.toState(block),
      createdAt: block.createdAt.toISOString(),
      updatedAt: block.updatedAt.toISOString(),
    };
  }

  toResponseList(blocks: AvailabilityBlockWithAppointments[]): AvailabilityBlockResponse[] {
    return blocks.map((block) => this.toResponse(block));
  }

  private toState(block: AvailabilityBlockWithAppointments): AvailabilityBlockState {
    const statuses = block.appointments.map((appointment) => appointment.status.title);
    if (statuses.includes(APPOINTMENT_STATUS_CONFIRMED)) {
      return 'confirmed';
    }
    if (statuses.includes(APPOINTMENT_STATUS_PENDING)) {
      return 'pending';
    }
    return 'free';
  }
}
