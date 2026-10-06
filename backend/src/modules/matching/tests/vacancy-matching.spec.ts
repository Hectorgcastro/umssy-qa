import { describe, expect, it, vi } from 'vitest';
import { GapAnalysisService } from '../services/gap-analysis.service.js';
import { SkillDictionaryService } from '../services/skill-dictionary.service.js';
import { MatchScoreService } from '../services/match-score.service.js';
import { VacancyMatchingService } from '../services/vacancy-matching.service.js';
import { VacanciesService } from '../services/vacancies.service.js';
import type { VacanciesRepository } from '../repositories/vacancies.repository.js';
import type { VacancyRecord } from '../types/vacancy.types.js';
import { experienceYears } from '../utils/experience-years.js';
import { vacanciesQuerySchema } from '../requests/vacancies-query.schema.js';

describe('Matching QA (#264)', () => {
  const gap = new GapAnalysisService(new SkillDictionaryService());
  const matching = new VacancyMatchingService(gap, new MatchScoreService(gap));
  const vacancy: VacancyRecord = {
    id: 'a',
    title: 'Dev',
    companyName: 'UMSS',
    description: '',
    requiredSkills: ['Python'],
    academicRequirements: ['Ingeniería de Sistemas'],
    otherRequirements: [],
    minExperienceYears: 2,
  };
  const profile = {
    skills: ['PYTHON'],
    academicQualifications: ['Ingeniería de Sistemas'],
    submittedRequirements: [],
    experienceYears: 2,
  };

  it.each([
    'Ingeniería Civil',
    'Ingeniería',
    'UMSS',
    'Ingeniería de Sistemas Computacionales',
    '',
  ])('does not infer career match from %s', (degree) => {
    expect(
      matching.match(vacancy, { ...profile, academicQualifications: [degree] })
        .careerMatch,
    ).toBe(false);
  });
  it('matches exact career case-insensitively and rejects insufficient experience', () => {
    expect(
      matching.match(vacancy, {
        ...profile,
        academicQualifications: ['ingenieria de sistemas'],
      }).careerMatch,
    ).toBe(true);
    expect(
      matching.match(vacancy, { ...profile, experienceYears: 1.99 })
        .experienceMatch,
    ).toBe(false);
  });
  it('does not count concurrent roles twice or future experience', () => {
    const period = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      isCurrent: false,
    };
    expect(
      experienceYears([period, period], new Date('2025-01-01')),
    ).toBeCloseTo(1, 2);
    expect(
      experienceYears(
        [{ ...period, startDate: new Date('2026-01-01') }],
        new Date('2025-01-01'),
      ),
    ).toBe(0);
  });
  it('ranks by career then experience then skills before slicing pages', async () => {
    const repository = {
      findActive: vi.fn().mockResolvedValue([
        {
          ...vacancy,
          id: 'wrong-career',
          academicRequirements: ['Ingeniería Civil'],
        },
        { ...vacancy, id: 'less-experience', minExperienceYears: 4 },
        { ...vacancy, id: 'best' },
      ]),
      findProfile: vi
        .fn()
        .mockResolvedValue({
          userSkills: [{ skill: { name: 'Python' } }],
          educations: [{ degree: 'Ingeniería de Sistemas' }],
          workExperiences: [
            {
              startDate: new Date('2000-01-01'),
              endDate: new Date('2002-01-02'),
              isCurrent: false,
              detectedSkills: [],
            },
          ],
        }),
      findActiveById: vi.fn().mockResolvedValue(null),
    };
    const service = new VacanciesService(
      repository as unknown as VacanciesRepository,
      matching,
    );
    expect((await service.findRecommended('owner', 1, 1)).items[0]?.id).toBe(
      'best',
    );
    expect((await service.findRecommended('owner', 2, 1)).items[0]?.id).toBe(
      'less-experience',
    );
    await expect(service.findDetail('owner', 'expired')).rejects.toMatchObject({
      statusCode: 404,
    });
    repository.findProfile.mockResolvedValueOnce(null);
    await expect(
      service.findRecommended('missing', 1, 20),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
  it('validates paging limits', () => {
    expect(vacanciesQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
    for (const input of [
      { page: 0 },
      { page: 1.5 },
      { limit: 101 },
      { page: 'bad' },
    ])
      expect(vacanciesQuerySchema.safeParse(input).success).toBe(false);
  });
});
