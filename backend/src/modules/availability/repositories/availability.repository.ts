import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { Prisma } from '../../../prisma/client.js';
import { BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE } from '../constants/block-query.constants.js';
import { BlockOverlapException } from '../exceptions/block-overlap.exception.js';
import type { AvailabilityBlockWithAppointments } from '../types/availability-block-with-appointments.types.js';


const DRIVER_ADAPTER_ERROR_CODE = 'P2039';
const POSTGRES_EXCLUSION_VIOLATION = '23P01';

interface UpdateBlockData {
  startAt: Date;
  endAt: Date;
}

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

  async update(id: string, data: UpdateBlockData): Promise<AvailabilityBlockWithAppointments> {
    try {
      return await this.prisma.availabilityBlock.update({
        where: { id },
        data,
        include: BLOCK_WITH_ACTIVE_APPOINTMENTS_INCLUDE,
      });
    } catch (error) {
      if (this.isOverlapViolation(error)) {
        throw new BlockOverlapException();
      }
      throw error;
    }
  }

  private isOverlapViolation(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }
    if (error.code !== DRIVER_ADAPTER_ERROR_CODE) {
      return false;
    }
    const meta = error.meta as { driverAdapterError?: { cause?: { code?: string } } } | undefined;
    return meta?.driverAdapterError?.cause?.code === POSTGRES_EXCLUSION_VIOLATION;
  }
}
