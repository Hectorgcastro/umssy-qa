import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { CreateEducationRequest } from '../requests/create-education.request.js';
import type { UpdateEducationRequest } from '../requests/update-education.request.js';
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

  create(
    userId: string,
    data: CreateEducationRequest,
  ): Promise<EducationRecord> {
    return this.prisma.education.create({
      data: { ...data, userId },
      select: educationSelect,
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateEducationRequest,
  ): Promise<EducationRecord | null> {
    const records = await this.prisma.education.updateManyAndReturn({
      where: { id, userId },
      data,
      select: educationSelect,
    });
    return records[0] ?? null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.prisma.education.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}
