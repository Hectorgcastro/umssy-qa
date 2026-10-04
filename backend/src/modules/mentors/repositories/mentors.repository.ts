import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { MENTOR_ROLE_NAME } from '../constants/mentor.constants.js';

@Injectable()
export class MentorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMentorRole() {
    return this.prisma.role.findUnique({
      where: {
        name: MENTOR_ROLE_NAME,
      },
      select: {
        id: true,
      },
    });
  }

  findActiveUserRole(userId: string, roleId: string) {
    return this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
  }

  findTechnicalAreas(ids: string[]) {
    return this.prisma.technicalArea.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
      },
    });
  }

  findActiveOrientationTypes(ids: string[]) {
    return this.prisma.orientationType.findMany({
      where: {
        id: {
          in: ids,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  }

  activate(
    userId: string,
    roleId: string,
    technicalAreaIds: string[],
    orientationTypeIds: string[],
  ) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.userRole.create({
        data: {
          userId,
          roleId,
          deletedAt: null,
        },
      });

      await transaction.mentorTechnicalArea.createMany({
        data: technicalAreaIds.map((technicalAreaId) => ({
          mentorId: userId,
          technicalAreaId,
        })),
      });

      await transaction.mentorOrientationType.createMany({
        data: orientationTypeIds.map((orientationTypeId) => ({
          mentorId: userId,
          orientationTypeId,
        })),
      });

      return { id: userId };
    });
  }
}
