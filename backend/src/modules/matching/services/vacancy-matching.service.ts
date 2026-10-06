import { Injectable } from '@nestjs/common';
import { GapAnalysisService } from './gap-analysis.service.js';
import { MatchScoreService } from './match-score.service.js';
import type { CandidateProfile } from '../types/candidate-profile.types.js';
import type { VacancyRecord } from '../types/vacancy.types.js';

@Injectable()
export class VacancyMatchingService {
  constructor(
    private readonly gapAnalysis: GapAnalysisService,
    private readonly score: MatchScoreService,
  ) {}

  match(vacancy: VacancyRecord, profile: CandidateProfile) {
    const gap = this.gapAnalysis.analyze(vacancy, profile);
    const careerMatch = gap.academicRequirements.every(
      ({ status }) => status === 'Cumple',
    );
    const experienceMatch =
      profile.experienceYears >= vacancy.minExperienceYears;
    const matchingSkills = gap.skills.filter(
      ({ status }) => status === 'Cumple',
    ).length;
    return {
      ...vacancy,
      compatibility: this.score.calculate(vacancy, profile),
      careerMatch,
      experienceMatch,
      matchingSkills,
      gap,
    };
  }
}
