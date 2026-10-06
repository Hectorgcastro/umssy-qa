import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';
import { AvailabilityModule } from './modules/availability/availability.module.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { TechnicalAreasModule } from './modules/technical-areas/technical-areas.module.js';
import { OrientationTypesModule } from './modules/orientation-types/orientation-types.module.js';
import { MentorsModule } from './modules/mentors/mentors.module.js';
import { AccessRequestsModule } from './modules/access-requests/access-requests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AvailabilityModule,
    AuthModule,
    TechnicalAreasModule,
    OrientationTypesModule,
    MentorsModule,
    AccessRequestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {}
