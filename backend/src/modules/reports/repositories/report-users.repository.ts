import {
  Injectable,
  Logger,
  type OnModuleInit,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type {
  ReportDocumentType,
  ReportRegistrationStatus,
  ReportUser,
  ReportUserType,
} from '../types/report-user.types.js';

const ROLE_NAME_TO_USER_TYPE: Record<string, ReportUserType> = {
  titulado: 'DEGREE_HOLDER',
  estudiante: 'STUDENT',
  mentor: 'MENTOR',
  empresa: 'COMPANY',
  administrativo: 'ADMIN',
};

@Injectable()
export class ReportUsersRepository implements OnModuleInit {
  private readonly logger = new Logger(ReportUsersRepository.name);
  private cache: ReportUser[] = [];
  private refreshPromise: Promise<void> | null = null;

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this.prisma) {
      return;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefresh(): Promise<void> {
    if (!this.prisma) {
      return;
    }

    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          identifier: true,
          documentType: true,
          registrationStatus: true,
          rejectionReason: true,
          isActive: true,
          createdAt: true,
          roles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              deletedAt: null,
            },
            orderBy: {
              startAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.cache = users.map((user) => {
        const primaryRoleName = user.roles[0]?.role?.name?.toLowerCase().trim();
        const userType: ReportUserType =
          (primaryRoleName && ROLE_NAME_TO_USER_TYPE[primaryRoleName]) ||
          'STUDENT';

        return {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          userType,
          identifier: user.identifier ?? '',
          documentType:
            (user.documentType as ReportDocumentType) ?? 'ACADEMIC_DEGREE',
          registeredAt: user.createdAt.toISOString(),
          registrationStatus:
            (user.registrationStatus as ReportRegistrationStatus) ||
            (user.isActive ? 'APPROVED' : 'REJECTED'),
          rejectionReason: user.rejectionReason,
        };
      });
    } catch (error) {
      this.logger.error('Error al sincronizar usuarios desde Prisma', error);
    }
  }

  findAll(): readonly ReportUser[] {
    void this.refresh();
    return this.cache;
  }
}
