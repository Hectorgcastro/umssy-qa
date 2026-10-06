import { Injectable } from '@nestjs/common';
import { SkillDictionaryService } from './skill-dictionary.service.js';
import type { CandidateProfile } from '../types/candidate-profile.types.js';
import type { VacancyRecord } from '../types/vacancy.types.js';
import type { RequirementState } from '../types/requirement-state.types.js';

@Injectable()
export class GapAnalysisService {
  constructor(private readonly dictionary: SkillDictionaryService) {}

  analyze(vacancy: VacancyRecord, profile: CandidateProfile) {
    const compare = (
      required: string[],
      possessed: string[],
      skills = false,
    ): RequirementState[] => {
      const canonicalize = (term: string) =>
        skills
          ? this.dictionary.canonicalize(term)
          : this.dictionary.normalizeTerm(term);
      const owned = new Set(possessed.map(canonicalize));
      const unique = new Map(
        required.map((name) => [canonicalize(name), name.trim()]),
      );
      return [...unique]
        .filter(([key]) => key)
        .map(([key, name]) => ({
          name,
          status: owned.has(key) ? 'Cumple' : 'Pendiente',
        }));
    };
    const skills = compare(vacancy.requiredSkills, profile.skills, true);
    const academicRequirements = compare(
      vacancy.academicRequirements,
      profile.academicQualifications,
    );
    const otherRequirements = compare(
      vacancy.otherRequirements,
      profile.submittedRequirements,
    );
    const experienceRequirements: RequirementState[] =
      vacancy.minExperienceYears > 0
        ? [
            {
              name: `${vacancy.minExperienceYears} años de experiencia`,
              status:
                profile.experienceYears >= vacancy.minExperienceYears
                  ? 'Cumple'
                  : 'Pendiente',
            },
          ]
        : [];
    const missing = [
      ...skills,
      ...academicRequirements,
      ...otherRequirements,
      ...experienceRequirements,
    ].filter(({ status }) => status === 'Pendiente');
    return {
      skills,
      academicRequirements,
      otherRequirements,
      experienceRequirements,
      missingSkills: skills
        .filter(({ status }) => status === 'Pendiente')
        .map(({ name }) => name),
      complete: missing.length === 0,
      message:
        missing.length === 0
          ? 'Para esta oportunidad no tienes habilidades ni requisitos pendientes'
          : null,
    };
  }
}
