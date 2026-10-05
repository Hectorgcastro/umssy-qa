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

  findActiveMentors(now: Date) {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        roles: {
          some: {
            deletedAt: null,
            startAt: {
              lte: now,
            },
            role: {
              name: MENTOR_ROLE_NAME,
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        headline: true,
        mentorTechnicalAreas: {
          select: {
            technicalArea: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          firstName: 'asc',
        },
        {
          lastName: 'asc',
        },
      ],
    });
  }

  findActiveMentorParticipation(userId: string, now: Date) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true,
        roles: {
          some: {
            deletedAt: null,
            startAt: {
              lte: now,
            },
            role: {
              name: MENTOR_ROLE_NAME,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  findMentorTechnicalAreas(userId: string) {
    return this.prisma.mentorTechnicalArea.findMany({
      where: {
        mentorId: userId,
      },
      select: {
        technicalArea: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        technicalArea: {
          name: 'asc',
        },
      },
    });
  }

  findActiveMentorById(userId: string, now: Date) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true,
        roles: {
          some: {
            deletedAt: null,
            startAt: {
              lte: now,
            },
            role: {
              name: MENTOR_ROLE_NAME,
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        headline: true,
        aboutMe: true,
        photoUrl: true,
        city: {
          select: {
            id: true,
            title: true,
          },
        },
        educations: {
          select: {
            id: true,
            institution: true,
            degree: true,
            startDate: true,
            endDate: true,
            description: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
        workExperiences: {
          select: {
            id: true,
            position: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
            description: true,
            company: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: [
            {
              isCurrent: 'desc',
            },
            {
              startDate: 'desc',
            },
          ],
        },
        userSkills: {
          select: {
            skill: {
              select: {
                id: true,
                name: true,
                isCustom: true,
              },
            },
          },
          orderBy: {
            skill: {
              name: 'asc',
            },
          },
        },
        certifications: {
          select: {
            id: true,
            name: true,
            issuingOrganization: true,
            issueDate: true,
            documentUrl: true,
          },
          orderBy: {
            issueDate: 'desc',
          },
        },
        mentorTechnicalAreas: {
          select: {
            technicalArea: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: {
            technicalArea: {
              name: 'asc',
            },
          },
        },
        mentorOrientationTypes: {
          where: {
            orientationType: {
              isActive: true,
            },
          },
          select: {
            orientationType: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: {
            orientationType: {
              name: 'asc',
            },
          },
        },
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

  replaceMentorTechnicalAreas(userId: string, technicalAreaIds: string[]) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.mentorTechnicalArea.deleteMany({
        where: {
          mentorId: userId,
        },
      });

      await transaction.mentorTechnicalArea.createMany({
        data: technicalAreaIds.map((technicalAreaId) => ({
          mentorId: userId,
          technicalAreaId,
        })),
      });
    });
  }
}
