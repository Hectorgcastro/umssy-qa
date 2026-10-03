import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

@Injectable()
export class EventRegistrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string) {
    return this.prisma.eventRegistration.findMany({
      where: { userId },
      select: {
        id: true,
        status: { select: { title: true } },
        event: {
          select: {
            title: true,
            eventDate: true,
            location: true,
          },
        },
      },
      orderBy: { event: { eventDate: 'asc' } },
    });
  }
}