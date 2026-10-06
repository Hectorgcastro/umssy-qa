import { Module } from '@nestjs/common';
import { MatchingController } from './controllers/matching.controller.js';
import { MatchingService } from './services/matching.service.js';
import { NlpService } from './services/nlp.service.js';
import { SkillDictionaryService } from './services/skill-dictionary.service.js';
import { JwtAuthModule } from '../../common/guards/jwt-auth.module.js';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { VacanciesController } from './controllers/vacancies.controller.js';
import { VacanciesRepository } from './repositories/vacancies.repository.js';
import { VacanciesService } from './services/vacancies.service.js';
import { VacancyMatchingService } from './services/vacancy-matching.service.js';
import { GapAnalysisService } from './services/gap-analysis.service.js';
import { MatchScoreService } from './services/match-score.service.js';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  controllers: [MatchingController, VacanciesController],
  providers: [MatchingService, NlpService, SkillDictionaryService, VacanciesRepository, VacanciesService, VacancyMatchingService, GapAnalysisService, MatchScoreService],
  exports: [MatchingService, NlpService, SkillDictionaryService],
})
export class MatchingModule {}
