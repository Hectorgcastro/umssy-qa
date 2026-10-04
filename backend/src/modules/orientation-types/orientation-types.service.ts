import { Injectable } from '@nestjs/common';
import { OrientationTypesRepository } from './orientation-types.repository.js';
import { OrientationTypeMapper, OrientationTypeResponseDto } from './dto/orientation-type-response.dto.js';

@Injectable()
export class OrientationTypesService {
  constructor(private readonly orientationTypesRepository: OrientationTypesRepository) {}

  async findAll(): Promise<OrientationTypeResponseDto[]> {
    const orientationTypes = await this.orientationTypesRepository.findActiveOrientationTypes();
    return OrientationTypeMapper.toDtoList(orientationTypes);
  }
}