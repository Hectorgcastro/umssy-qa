import { Injectable, type OnModuleInit, Optional } from '@nestjs/common';
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
  egresado: 'GRADUATE',
};

@Injectable()
export class ReportUsersRepository implements OnModuleInit {
  private cache: ReportUser[] = [];

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this.prisma) {
      return;
    }

    try {
      const users = await this.prisma.user.findMany({
        include: {
          roles: {
            include: {
              role: true,
            },
            where: {
              deletedAt: null,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.cache = users.map((user) => {
        const primaryRoleName = user.roles[0]?.role?.name;
        const userType: ReportUserType =
          (primaryRoleName && ROLE_NAME_TO_USER_TYPE[primaryRoleName]) || 'STUDENT';

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
      console.error('Error al sincronizar usuarios desde Prisma/Supabase:', error);
    }
  }

  findAll(): readonly ReportUser[] {
    void this.refresh();
    return this.cache;
  }
}

