import { Controller, Get, HttpStatus } from '@nestjs/common';
import { OrientationTypesService } from './orientation-types.service.js';
import { OrientationTypeResponseDto } from './dto/orientation-type-response.dto.js';

@Controller('orientation-types')
export class OrientationTypesController {
  constructor(private readonly orientationTypesService: OrientationTypesService) {}

  @Get()
  async findAll(): Promise<{ statusCode: number; data: OrientationTypeResponseDto[] }> {
    const data = await this.orientationTypesService.findAll();
    
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}