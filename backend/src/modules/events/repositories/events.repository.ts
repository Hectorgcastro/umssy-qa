import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { GetEventsPayload } from '../requests/get-events.request.js';
import type { EventRawRecord } from '../types/events.types.js';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(payload: GetEventsPayload): Promise<EventRawRecord[]> {
    const { page, limit, categoryId, statusId, from, to } = payload;
    const skip = (page - 1) * limit;

    return this.prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true,
        instructorName: true,
        eventDate: true,
        startTime: true,
        endTime: true,
        location: true,
        capacity: true,
        statusId: true,
        modalityId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            registrations: {
              where: { cancelledAt: null },
            },
          },
        },
      },
      where: {
        ...(categoryId !== undefined && { categoryId }),
        ...(statusId !== undefined && { statusId }),
        ...(from !== undefined || to !== undefined
          ? {
              eventDate: {
                ...(from !== undefined && { gte: new Date(from) }),
                ...(to !== undefined && { lte: new Date(to) }),
              },
            }
          : {}),
      },
      orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
      skip,
      take: limit,
    }) as unknown as EventRawRecord[];
  }
}
