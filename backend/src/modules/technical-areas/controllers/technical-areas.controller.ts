import { Controller, Get } from '@nestjs/common';
import { TechnicalAreasService } from '../services/technical-areas.service.js';

@Controller('technical-areas')
export class TechnicalAreasController {
  constructor(private readonly technicalAreasService: TechnicalAreasService) {}

  @Get()
  findAll() {
    return this.technicalAreasService.findAll();
  }
}
