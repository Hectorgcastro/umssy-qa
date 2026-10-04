import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { EducationRecord } from '../types/education-record.type.js';

const educationSelect = {
  id: true,
  userId: true,
  institution: true,
  degree: true,
  startDate: true,
  endDate: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class EducationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findManyByUserId(userId: string): Promise<EducationRecord[]> {
    return this.prisma.education.findMany({
      where: { userId },
      orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
      select: educationSelect,
    });
  }

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<EducationRecord | null> {
    return this.prisma.education.findFirst({
      where: { id, userId },
      select: educationSelect,
    });
  }
}
