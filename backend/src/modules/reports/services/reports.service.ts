import { Injectable } from '@nestjs/common';
import type { PaginatedResult } from '../../../common/types/api-response.types.js';
import { paginate } from '../../../common/utils/pagination.js';
import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import type {
  RegisteredUsersQuery,
  RejectedUsersQuery,
} from '../requests/report-users.schema.js';
import type { ReportUser } from '../types/report-user.types.js';

// Ignora mayúsculas y tildes para que "perez" encuentre "Pérez".
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function matchesSearch(user: ReportUser, search?: string): boolean {
  if (!search) {
    return true;
  }

  const term = normalizeText(search);
  return [user.fullName, user.email, user.identifier ?? ''].some((value) =>
    normalizeText(value).includes(term),
  );
}

function sortByNewest(users: ReportUser[]): ReportUser[] {
  return users.sort(
    (first, second) =>
      new Date(second.registeredAt).getTime() -
      new Date(first.registeredAt).getTime(),
  );
}

@Injectable()
export class ReportsService {
  constructor(private readonly reportUsersRepository: ReportUsersRepository) {}

  // Usuarios registrados: solo los registros aprobados.
  getRegisteredUsers(query: RegisteredUsersQuery): PaginatedResult<ReportUser> {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'approved')
      .filter(
        (user) => query.userType === 'all' || user.userType === query.userType,
      )
      .filter(
        (user) =>
          query.year === undefined ||
          new Date(user.registeredAt).getUTCFullYear() === query.year,
      )
      .filter((user) => matchesSearch(user, query.search));

    return paginate(sortByNewest(users), query.page, query.limit);
  }

  getRejectedUsers(query: RejectedUsersQuery): PaginatedResult<ReportUser> {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'rejected')
      .filter((user) => matchesSearch(user, query.search));

    return paginate(sortByNewest(users), query.page, query.limit);
  }
}
