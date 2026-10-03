import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AvailabilityModule } from './modules/availability/availability.module.js';
import { CertificationsModule } from './modules/certifications/certifications.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AvailabilityModule,
    CertificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
