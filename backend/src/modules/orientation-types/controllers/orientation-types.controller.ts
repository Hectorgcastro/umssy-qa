import { Controller, Get } from '@nestjs/common';
import { OrientationTypesService } from '../services/orientation-types.service.js';
import type { OrientationTypeResponse } from '../types/orientation-type-response.types.js';

@Controller('orientation-types')
export class OrientationTypesController {
  constructor(
    private readonly orientationTypesService: OrientationTypesService,
  ) {}

  @Get()
  findAll(): Promise<OrientationTypeResponse[]> {
    return this.orientationTypesService.findAll();
  }
}
