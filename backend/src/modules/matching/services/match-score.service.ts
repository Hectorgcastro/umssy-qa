import { Injectable } from '@nestjs/common';
import { GapAnalysisService } from './gap-analysis.service.js';
import { MATCH_SCORE_WEIGHTS } from '../constants/match-score.constants.js';
import type { CandidateProfile } from '../types/candidate-profile.types.js';
import type { VacancyRecord } from '../types/vacancy.types.js';

@Injectable()
export class MatchScoreService {
  constructor(private readonly gapAnalysis: GapAnalysisService) {}

  calculate(vacancy: VacancyRecord, profile: CandidateProfile): number {
    const gap = this.gapAnalysis.analyze(vacancy, profile);
    let totalWeight = 0;
    let matchedWeight = 0;
    for (const category of Object.keys(
      MATCH_SCORE_WEIGHTS,
    ) as (keyof typeof MATCH_SCORE_WEIGHTS)[]) {
      const requirements = gap[category];
      if (!requirements.length) continue;
      const weight = MATCH_SCORE_WEIGHTS[category];
      totalWeight += weight;
      matchedWeight +=
        (weight *
          requirements.filter(({ status }) => status === 'Cumple').length) /
        requirements.length;
    }
    return totalWeight === 0
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.round((100 * matchedWeight) / totalWeight + 1e-10),
          ),
        );
  }
}
