import { Module } from '@nestjs/common';
import { TechnicalAreasController } from './controllers/technical-areas.controller.js';
import { TechnicalAreasRepository } from './repositories/technical-areas.repository.js';
import { TechnicalAreasService } from './services/technical-areas.service.js';

@Module({
  controllers: [TechnicalAreasController],
  providers: [TechnicalAreasService, TechnicalAreasRepository],
})
export class TechnicalAreasModule {}
