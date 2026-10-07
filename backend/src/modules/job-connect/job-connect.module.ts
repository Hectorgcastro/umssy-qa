import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { VacanciesController } from './controllers/vacancies.controller.js';
import { VacanciesRepository } from './repositories/vacancies.repository.js';
import { VacanciesService } from './services/vacancies.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [VacanciesController],
  providers: [VacanciesRepository, VacanciesService],
})
export class JobConnectModule {}
