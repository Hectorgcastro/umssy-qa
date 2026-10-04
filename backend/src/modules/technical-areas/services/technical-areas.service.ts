import { Injectable } from '@nestjs/common';
import { TechnicalAreasRepository } from '../repositories/technical-areas.repository.js';
import type { TechnicalAreaResponse } from '../types/technical-area-response.types.js';

@Injectable()
export class TechnicalAreasService {
  constructor(private readonly technicalAreasRepository: TechnicalAreasRepository) {}

  findAll(): Promise<TechnicalAreaResponse[]> {
    return this.technicalAreasRepository.findAll();
  }
}
