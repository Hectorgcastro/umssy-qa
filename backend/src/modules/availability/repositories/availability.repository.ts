import { Injectable } from '@nestjs/common';
import type { AvailabilityBlock } from '../../../prisma/client.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(mentorId: string, startAt: Date, endAt: Date): Promise<AvailabilityBlock> {
    return this.prisma.availabilityBlock.create({
      data: { mentorId, startAt, endAt },
    });
  }
}
