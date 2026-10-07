import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { GapAnalysisService } from '../services/gap-analysis.service.js';
import { SkillDictionaryService } from '../services/skill-dictionary.service.js';
import { VacancyGapService } from '../services/vacancy-gap.service.js';
import { profileRequirementsSchema } from '../requests/profile-requirements.schema.js';
import type { VacanciesRepository } from '../repositories/vacancies.repository.js';

describe('Gap analysis (#283)', () => {
  const gap = new GapAnalysisService(new SkillDictionaryService());
  const required = {
    requiredSkills: ['Python', 'PYTHON', 'JS', 'C++', 'C#'],
    academicRequirements: ['Ingeniería de Sistemas'],
    otherRequirements: ['Carta'],
  };
  const profile = {
    skills: ['python', 'JavaScript', 'C++'],
    academicQualifications: ['Ingeniería Civil'],
    submittedRequirements: [],
  };
  it('subtracts canonical sets, deduplicates and separates categories', () => {
    const result = gap.analyze(required, profile);
    expect(result.missingSkills).toEqual(['C#']);
    expect(result.skills).toHaveLength(4);
    expect(result.academicRequirements[0]?.status).toBe('Pendiente');
    expect(result.otherRequirements[0]?.status).toBe('Pendiente');
  });
  it('recalculates complete profiles and empty requirements', () => {
    expect(
      gap.analyze(required, {
        skills: ['Python', 'JS', 'C++', 'C#'],
        academicQualifications: ['ingenieria de sistemas'],
        submittedRequirements: ['Carta'],
      }),
    ).toMatchObject({ complete: true, missingSkills: [] });
    expect(
      gap.analyze(
        { requiredSkills: [], academicRequirements: [], otherRequirements: [] },
        profile,
      ).complete,
    ).toBe(true);
  });
  it('returns the stored vacancy analysis and rejects missing or inactive vacancies', async () => {
    const repository = { findActiveById: vi.fn().mockResolvedValue(required) };
    const service = new VacancyGapService(
      repository as unknown as VacanciesRepository,
      gap,
    );
    expect(await service.analyze('vacancy', profile)).toMatchObject({
      vacancyId: 'vacancy',
      missingSkills: ['C#'],
    });
    repository.findActiveById.mockResolvedValue(null);
    await expect(service.analyze('missing', profile)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
  it('validates lists and defaults optional categories', () => {
    expect(profileRequirementsSchema.parse({ skills: [] })).toEqual({
      skills: [],
      academicQualifications: [],
      submittedRequirements: [],
    });
    expect(profileRequirementsSchema.safeParse({ skills: [' '] }).success).toBe(
      false,
    );
    expect(
      profileRequirementsSchema.safeParse({ skills: 'Python' }).success,
    ).toBe(false);
  });
});
