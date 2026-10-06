import { describe, expect, it } from 'vitest';
import { MatchScoreService } from '../services/match-score.service.js';
import { GapAnalysisService } from '../services/gap-analysis.service.js';
import { SkillDictionaryService } from '../services/skill-dictionary.service.js';
import type { VacancyRecord } from '../types/vacancy.types.js';

describe('Match score stress (#277)', () => {
  const service = new MatchScoreService(new GapAnalysisService(new SkillDictionaryService()));
  const vacancy: VacancyRecord = { id: 'v', title: 'Dev', companyName: 'UMSS', description: '', requiredSkills: ['Python', 'Java'], academicRequirements: [], otherRequirements: [], minExperienceYears: 0 };
  const profile = { skills: [], academicQualifications: [], submittedRequirements: [], experienceYears: 0 };
  it.each([[[], 0], [['Python'], 50], [['Python', 'Java'], 100], [['Python', 'Java', 'Scrum'], 100]] as [string[], number][])('computes boundary %s', (skills, score) => {
    expect(service.calculate(vacancy, { ...profile, skills })).toBe(score);
  });
  it('renormalizes absent categories and does not inflate duplicate requirements', () => {
    expect(service.calculate({ ...vacancy, requiredSkills: ['python', 'PYTHON', 'Java'] }, { ...profile, skills: ['Python'] })).toBe(50);
    expect(service.calculate({ ...vacancy, requiredSkills: [] }, profile)).toBe(100);
  });
  it('uses all documented weights', () => {
    const fullVacancy = { ...vacancy, academicRequirements: ['Sistemas'], minExperienceYears: 1, otherRequirements: ['Carta'] };
    expect(service.calculate(fullVacancy, { ...profile, skills: ['Python', 'Java'] })).toBe(60);
    expect(service.calculate(fullVacancy, { ...profile, skills: ['Python', 'Java'], academicQualifications: ['Sistemas'], experienceYears: 1, submittedRequirements: ['Carta'] })).toBe(100);
    expect(service.calculate(fullVacancy, profile)).toBe(0);
  });
  it('remains deterministic and bounded over large profiles', () => {
    const skills = Array.from({ length: 1000 }, (_, index) => `skill-${index}`);
    const largeVacancy = { ...vacancy, requiredSkills: skills };
    for (let size = 0; size <= 1000; size += 37) {
      const candidate = { ...profile, skills: skills.slice(0, size) };
      const score = service.calculate(largeVacancy, candidate);
      expect(score).toBe(Math.round(size / 10));
      expect(service.calculate(largeVacancy, candidate)).toBe(score);
    }
  });
});
