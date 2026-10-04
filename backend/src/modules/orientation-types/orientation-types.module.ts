import { Module } from '@nestjs/common';
import { OrientationTypesController } from './orientation-types.controller.js';
import { OrientationTypesService } from './orientation-types.service.js';
import { PrismaModule } from '../../common/prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [OrientationTypesController],
  providers: [OrientationTypesService],
  exports: [OrientationTypesService],
})
export class OrientationTypesModule {}