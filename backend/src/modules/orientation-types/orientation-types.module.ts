import { Module } from '@nestjs/common';
import { OrientationTypesController } from './controllers/orientation-types.controller.js';
import { OrientationTypesRepository } from './repositories/orientation-types.repository.js';
import { OrientationTypesService } from './services/orientation-types.service.js';

@Module({
  controllers: [OrientationTypesController],
  providers: [OrientationTypesService, OrientationTypesRepository],
})
export class OrientationTypesModule {}
