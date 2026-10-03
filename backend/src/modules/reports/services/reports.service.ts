import { Injectable } from '@nestjs/common';
import type { PaginatedResult } from '../../../common/types/api-response.types.js';
import { paginate } from '../../../common/utils/pagination.js';
import {
  toRegisteredUserResponse,
  toRejectedUserResponse,
} from '../mappers/report-user.mapper.js';
import { ReportUsersRepository } from '../repositories/report-users.repository.js';
import type {
  RegisteredUsersQuery,
  RejectedUsersQuery,
} from '../requests/report-users.schema.js';
import type {
  RegisteredUserResponse,
  RejectedUserResponse,
  ReportUser,
} from '../types/report-user.types.js';

// Ignora mayúsculas y tildes para que "perez" encuentre "Pérez".
function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function containsSearch(values: string[], search?: string): boolean {
  if (!search) {
    return true;
  }

  const term = normalizeText(search);
  return values.some((value) => normalizeText(value).includes(term));
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
  getRegisteredUsers(
    query: RegisteredUsersQuery,
  ): PaginatedResult<RegisteredUserResponse> {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'APPROVED')
      .filter(
        (user) =>
          query.userType === undefined || user.userType === query.userType,
      )
      .filter(
        (user) =>
          query.year === undefined ||
          new Date(user.registeredAt).getUTCFullYear() === query.year,
      )
      .filter((user) =>
        containsSearch(
          [user.fullName, user.email, user.identifier],
          query.search,
        ),
      );

    return paginate(
      sortByNewest(users).map(toRegisteredUserResponse),
      query.page,
      query.limit,
    );
  }

  // Usuarios rechazados: el buscador filtra solo por correo, según el diseño.
  getRejectedUsers(
    query: RejectedUsersQuery,
  ): PaginatedResult<RejectedUserResponse> {
    const users = this.reportUsersRepository
      .findAll()
      .filter((user) => user.registrationStatus === 'REJECTED')
      .filter((user) => containsSearch([user.email], query.search));

    return paginate(
      sortByNewest(users).map(toRejectedUserResponse),
      query.page,
      query.limit,
    );
  }
}
