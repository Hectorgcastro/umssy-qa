import { Injectable } from '@nestjs/common';
import { AccessRequestsRepository } from '../repositories/access-requests.repository.js';
import {
  AccessRequestNotEditableException,
  AccessRequestNotFoundException,
  InvalidEntryYearException,
} from '../exceptions/index.js';
import { toAccessRequestResponse } from '../mappers/access-request.mapper.js';
import { isEntryYearCoherent } from '../requests/access-request-fields.js';
import type { CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import type { UpdateAccessRequestDto } from '../requests/update-access-request.schema.js';
import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

@Injectable()
export class AccessRequestsService {
  constructor(private readonly accessRequestsRepository: AccessRequestsRepository) {}

  async create(dto: CreateAccessRequestDto) {
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

    const updated = await this.accessRequestsRepository.updateDraft(id, dto);
    return toAccessRequestResponse(updated);
  }
}
