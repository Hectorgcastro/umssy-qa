import { Module } from '@nestjs/common';
import { NlpService } from './services/nlp.service.js';

@Module({
  providers: [NlpService],
  exports: [NlpService],
})
export class MatchingModule {}
