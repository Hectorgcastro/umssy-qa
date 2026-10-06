import { describe, expect, it } from 'vitest';
import { GapAnalysisService } from '../services/gap-analysis.service.js';
import { SkillDictionaryService } from '../services/skill-dictionary.service.js';
import type { VacancyRecord } from '../types/vacancy.types.js';

describe('Gap analysis (#283)', () => {
  const service = new GapAnalysisService(new SkillDictionaryService());
  const vacancy: VacancyRecord = {
    id: 'v',
    title: 'Developer',
    companyName: 'UMSS',
    description: '',
    requiredSkills: ['Python', 'python', 'JS'],
    academicRequirements: ['Ingeniería de Sistemas'],
    otherRequirements: ['Carta de motivación'],
    minExperienceYears: 2,
  };
  const profile = {
    skills: ['PYTHON', 'JavaScript'],
    academicQualifications: ['Ingeniería Civil'],
    submittedRequirements: [],
    experienceYears: 1,
  };
  it('compares exact academic qualifications and pending documents separately', () => {
    const result = service.analyze(vacancy, profile);
    expect(result.skills).toHaveLength(2);
    expect(result.missingSkills).toEqual([]);
    expect(result.academicRequirements[0]?.status).toBe('Pendiente');
    expect(result.otherRequirements[0]?.status).toBe('Pendiente');
    expect(result.experienceRequirements[0]?.status).toBe('Pendiente');
    expect(result.complete).toBe(false);
  });
  it('updates after changes and handles zero requirements', () => {
    const result = service.analyze(vacancy, {
      ...profile,
      academicQualifications: ['ingenieria de sistemas'],
      submittedRequirements: ['Carta de motivación'],
      experienceYears: 2,
    });
    expect(result.complete).toBe(true);
    expect(result.message).toBe(
      'Para esta oportunidad no tienes habilidades ni requisitos pendientes',
    );
    expect(
      service.analyze(
        {
          ...vacancy,
          requiredSkills: [],
          academicRequirements: [],
          otherRequirements: [],
          minExperienceYears: 0,
        },
        profile,
      ).complete,
    ).toBe(true);
  });
});
