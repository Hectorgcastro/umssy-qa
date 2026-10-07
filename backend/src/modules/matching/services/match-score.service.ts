import { Injectable } from '@nestjs/common';
import { GapAnalysisService } from './gap-analysis.service.js';
import { calculateWeightedScore } from '../utils/calculate-weighted-score.js';
import type { CandidateProfile } from '../types/candidate-profile.types.js';
import type { VacancyRecord } from '../types/vacancy.types.js';

@Injectable()
export class MatchScoreService {
  constructor(private readonly gapAnalysis: GapAnalysisService) {}

  calculate(vacancy: VacancyRecord, profile: CandidateProfile): number {
    const gap = this.gapAnalysis.analyze(vacancy, profile);
    return calculateWeightedScore(gap);
  }
}
