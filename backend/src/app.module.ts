import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
//import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';
import { AvailabilityModule } from './modules/availability/availability.module.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';

//import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { JobOffersModule } from './modules/job-offers/job-offers.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';





@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AvailabilityModule,
    AuthModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },   // NUEVO - mapea Zod a 422
    { provide: APP_FILTER, useClass: DomainExceptionFilter }, // ya lo tenias
    //{ provide: APP_FILTER, useClass: PrismaExceptionFilter }, // NUEVO - mapea Prisma a 500
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
