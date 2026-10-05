import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service.js';
import { AccessRequestsRepository } from '../repositories/access-requests.repository.js';
import {
  AccessRequestNotEditableException,
  AccessRequestNotFoundException,
  DuplicateAccessRequestDataException,
  InvalidEntryYearException,
} from '../exceptions/index.js';
import { toAccessRequestResponse } from '../mappers/access-request.mapper.js';
import { isEntryYearCoherent } from '../requests/access-request-fields.js';
import type { CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import type { UpdateAccessRequestDto } from '../requests/update-access-request.schema.js';
import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

const DUPLICATE_LABELS = {
  email: 'el correo',
  idCardNumber: 'el carnet de identidad',
  sisCode: 'el código SIS',
} as const;

type DuplicateField = keyof typeof DUPLICATE_LABELS;

@Injectable()
export class AccessRequestsService {
  constructor(
    private readonly accessRequestsRepository: AccessRequestsRepository,
    private readonly authService: AuthService,
  ) {}

  async create(dto: CreateAccessRequestDto) {
    await this.assertNoDuplicates(dto);
    const draft = await this.accessRequestsRepository.createDraft(dto);
    return { id: draft.id };
  }

  async update(id: string, dto: UpdateAccessRequestDto) {
    const current = await this.accessRequestsRepository.findById(id);
    if (!current) {
      throw new AccessRequestNotFoundException();
    }
    if (current.status.title !== ACCESS_REQUEST_STATUS.DRAFT) {
      throw new AccessRequestNotEditableException();
    }

    const entryYear = dto.entryYear ?? current.entryYear;
    const birthDate = dto.birthDate ?? current.birthDate;
    if (!isEntryYearCoherent(entryYear, birthDate)) {
      throw new InvalidEntryYearException();
    }

    await this.assertNoDuplicates(dto, id);

    const updated = await this.accessRequestsRepository.updateDraft(id, dto);
    return toAccessRequestResponse(updated);
  }

  // En el PATCH solo se revisan los campos enviados; excludeId deja editar el propio borrador
  private async assertNoDuplicates(
    dto: { email?: string; idCardNumber?: string; sisCode?: string },
    excludeId?: string,
  ) {
    const { email, idCardNumber, sisCode } = dto;
    if (email === undefined && idCardNumber === undefined && sisCode === undefined) return;

    const duplicated = new Set<DuplicateField>();

    if (email !== undefined && (await this.authService.existsByEmail(email))) {
      duplicated.add('email');
    }

    const requests = await this.accessRequestsRepository.findActiveDuplicates({ email, idCardNumber, sisCode, excludeId });
    for (const request of requests) {
      if (email !== undefined && request.email.toLowerCase() === email.toLowerCase()) duplicated.add('email');
      if (idCardNumber !== undefined && request.idCardNumber === idCardNumber) duplicated.add('idCardNumber');
      if (sisCode !== undefined && request.sisCode === sisCode) duplicated.add('sisCode');
    }

    if (duplicated.size === 0) return;

    const labels = (Object.keys(DUPLICATE_LABELS) as DuplicateField[])
      .filter((field) => duplicated.has(field))
      .map((field) => DUPLICATE_LABELS[field]);
    const list = labels.length > 1 ? `${labels.slice(0, -1).join(', ')} y ${labels.at(-1)}` : labels[0];
    const message = `${list.charAt(0).toUpperCase()}${list.slice(1)} ya ${labels.length > 1 ? 'están registrados' : 'está registrado'}`;
    throw new DuplicateAccessRequestDataException(message);
  }
}
