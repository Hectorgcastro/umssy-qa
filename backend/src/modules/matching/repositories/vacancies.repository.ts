import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { VACANCY_SELECT } from '../constants/vacancy.constants.js';

@Injectable()
export class VacanciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.vacancy.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: VACANCY_SELECT,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  findActiveById(id: string) {
    return this.prisma.vacancy.findFirst({
      where: {
        id,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: VACANCY_SELECT,
    });
  }

  findProfile(userId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: {
        userSkills: { select: { skill: { select: { name: true } } } },
        educations: { select: { degree: true } },
        workExperiences: {
          select: {
            startDate: true,
            endDate: true,
            isCurrent: true,
            detectedSkills: true,
          },
        },
      },
    });
  }
}
