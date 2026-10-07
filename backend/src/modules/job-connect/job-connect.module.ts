import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { VacanciesController } from './controllers/vacancies.controller.js';
import { VacanciesRepository } from './repositories/vacancies.repository.js';
import { VacanciesService } from './services/vacancies.service.js';
import { GapAnalysisController } from './controllers/gap-analysis.controller.js';
import { GapAnalysisService } from './services/gap-analysis.service.js';
import { SkillDictionaryService } from './services/skill-dictionary.service.js';
import { VacancyGapService } from './services/vacancy-gap.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [VacanciesController, GapAnalysisController],
  providers: [
    VacanciesRepository,
    VacanciesService,
    GapAnalysisService,
    SkillDictionaryService,
    VacancyGapService,
  ],
})
export class JobConnectModule {}
