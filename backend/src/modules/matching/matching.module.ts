import { Module } from '@nestjs/common';
import { MatchingController } from './controllers/matching.controller.js';
import { MatchingService } from './services/matching.service.js';
import { NlpService } from './services/nlp.service.js';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService, NlpService],
  exports: [MatchingService, NlpService],
})
export class MatchingModule {}
