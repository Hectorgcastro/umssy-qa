import { Injectable } from '@nestjs/common';
import type { AvailabilityBlock } from '../../../prisma/client.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import type { AvailabilityBlockWithAppointments } from '../types/availability-block-with-appointments.types.js';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMentorBlocksInRange(mentorId: string, from: Date, to: Date): Promise<AvailabilityBlockWithAppointments[]> {
    return this.prisma.availabilityBlock.findMany({
      where: { mentorId, startAt: { gte: from, lt: to } },
      orderBy: { startAt: 'asc' },
      include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
    });
  }

  findById(id: string): Promise<AvailabilityBlockWithAppointments | null> {
    return this.prisma.availabilityBlock.findUnique({
      where: { id },
      include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
    });
  }

  delete(id: string): Promise<AvailabilityBlock> {
    return this.prisma.availabilityBlock.delete({ where: { id } });
  }
}
