import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../common/interceptors/index.js';
import { OrientationTypesService } from '../services/orientation-types.service.js';
import type { OrientationTypeResponse } from '../types/orientation-type-response.types.js';

@Controller('orientation-types')
@UseInterceptors(ResponseInterceptor)
export class OrientationTypesController {
  constructor(
    private readonly orientationTypesService: OrientationTypesService,
  ) {}

  @Get()
  findAll(): Promise<OrientationTypeResponse[]> {
    return this.orientationTypesService.findAll();
  }
}
