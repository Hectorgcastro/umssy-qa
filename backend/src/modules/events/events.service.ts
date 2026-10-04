import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        modality: true,
        origin: true,
        status: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }
}