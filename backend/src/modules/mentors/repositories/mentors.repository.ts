import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';

@Injectable()
export class MentorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMentorRole() {
    return this.prisma.role.findUnique({
      where: {
        name: 'mentor',
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
    });
  }

  findTechnicalAreas(ids: string[]) {
    return this.prisma.technicalArea.findMany({
      where: {
        id: {
          in: ids,
        },
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

      return transaction.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          roles: {
            where: {
              deletedAt: null,
            },
            include: {
              role: true,
            },
          },
          mentorTechnicalAreas: {
            include: {
              technicalArea: true,
            },
          },
          mentorOrientationTypes: {
            include: {
              orientationType: true,
            },
          },
        },
      });
    });
  }
}