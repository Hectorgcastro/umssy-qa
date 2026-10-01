import { Injectable } from '@nestjs/common';
import { REPORT_USERS_MOCK } from '../mocks/report-users.mock.js';
import type { ReportUser } from '../types/report-user.types.js';

// Lee datos de prueba. Se reemplazará por consultas Prisma cuando existan los campos en la BD.
@Injectable()
export class ReportUsersRepository {
  findAll(): readonly ReportUser[] {
    return REPORT_USERS_MOCK;
  }
}
