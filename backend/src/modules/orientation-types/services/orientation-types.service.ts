import { Injectable } from '@nestjs/common';
import { OrientationTypesRepository } from '../repositories/orientation-types.repository.js';
import type { OrientationTypeResponse } from '../types/orientation-type-response.types.js';

@Injectable()
export class OrientationTypesService {
  constructor(
    private readonly orientationTypesRepository: OrientationTypesRepository,
  ) {}

  findAll(): Promise<OrientationTypeResponse[]> {
    return this.orientationTypesRepository.findActive();
  }
}
