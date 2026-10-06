import { Module } from '@nestjs/common';
import { MatchingController } from './controllers/matching.controller.js';
import { MatchingService } from './services/matching.service.js';
import { NlpService } from './services/nlp.service.js';
import { SkillDictionaryService } from './services/skill-dictionary.service.js';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService, NlpService, SkillDictionaryService],
  exports: [MatchingService, NlpService, SkillDictionaryService],
})
export class MatchingModule {}
