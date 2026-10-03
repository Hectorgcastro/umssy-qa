import { Injectable } from '@nestjs/common';
import type { PaginatedResult } from '../../../common/types/api-response.types.js';
import { buildCsv } from '../../../common/utils/csv.js';
import { paginate } from '../../../common/utils/pagination.js';
import {
  REGISTERED_USERS_CSV_HEADERS,
  toRegisteredUserCsvRow,
} from '../mappers/report-user-csv.mapper.js';
import {
  toRegisteredUserResponse,
  toRejectedUserResponse,
} from '../mappers/report-user.mapper.js';
import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import type {
  RegisteredUsersFilters,
  RegisteredUsersQuery,
  RejectedUsersQuery,
} from '../requests/report-users.schema.js';
import type {
  RegisteredUserResponse,
  RejectedUserResponse,
  ReportCsvFile,
  ReportUser,
} from '../types/report-user.types.js';

const REGISTERED_USERS_CSV_PREFIX = 'usuarios-registrados';

// Ignora mayúsculas y tildes para que "perez" encuentre "Pérez".
function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function matchesSearch(user: ReportUser, search?: string): boolean {
  if (!search) {
    return true;
  }

  const term = normalizeText(search);
  return [user.fullName, user.email, user.identifier].some((value) =>
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

  getRegisteredUsers(
    query: RegisteredUsersQuery,
  ): PaginatedResult<RegisteredUserResponse> {
    return paginate(this.findRegisteredUsers(query), query.page, query.limit);
  }

  // Exporta todas las filas que cumplen los filtros, no solo la página visible.
  exportRegisteredUsersCsv(filters: RegisteredUsersFilters): ReportCsvFile {
    const rows = this.findRegisteredUsers(filters).map(toRegisteredUserCsvRow);
    const today = new Date().toISOString().slice(0, 10);

    return {
      fileName: `${REGISTERED_USERS_CSV_PREFIX}-${today}.csv`,
      content: buildCsv(REGISTERED_USERS_CSV_HEADERS, rows),
    };
  }

  getRejectedUsers(
    query: RejectedUsersQuery,
  ): PaginatedResult<RejectedUserResponse> {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'REJECTED')
      .filter((user) => matchesSearch(user, query.search));

    return paginate(
      sortByNewest(users).map(toRejectedUserResponse),
      query.page,
      query.limit,
    );
  }

  // Usuarios registrados: solo los registros aprobados.
  private findRegisteredUsers(
    filters: RegisteredUsersFilters,
  ): RegisteredUserResponse[] {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'APPROVED')
      .filter(
        (user) =>
          filters.userType === undefined || user.userType === filters.userType,
      )
      .filter(
        (user) =>
          filters.year === undefined ||
          new Date(user.registeredAt).getUTCFullYear() === filters.year,
      )
      .filter((user) => matchesSearch(user, filters.search));

    return sortByNewest(users).map(toRegisteredUserResponse);
  }
}
