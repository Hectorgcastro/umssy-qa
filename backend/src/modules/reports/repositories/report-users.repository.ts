import { Injectable } from '@nestjs/common';
import type { ReportUser } from '../types/report-user.types.js';

// TEMPORAL: sin datos hasta conectar la BD.
// Se reemplazará por consultas Prisma cuando existan los campos en la BD.
@Injectable()
export class ReportUsersRepository {
  findAll(): readonly ReportUser[] {
    return [];
  }
}
