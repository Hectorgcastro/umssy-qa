import { describe, expect, it, vi } from 'vitest';
import { MatchingService } from '../services/matching.service.js';
import { NlpService } from '../services/nlp.service.js';
import { WorkExperienceRepository } from '../../work-experience/repositories/work-experience.repository.js';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';

describe('NLP pipeline and persistence load (#222)', () => {
  const service = new MatchingService();
  it('processes repeated maximum-length text within 2 seconds per request', () => {
    const text = 'Python Django Scrum Machine Learning UMSS '.repeat(125).slice(0, 5000);
    const start = performance.now();
    for (let index = 0; index < 100; index++) {
      const result = service.analyzeExperience({ experienceId: 'e', text });
      expect(result.skills.map(({ name }) => name)).toEqual(['Python', 'Django', 'Scrum', 'Machine Learning']);
      expect(result.processingTimeMs).toBeLessThan(2000);
    }
    expect(performance.now() - start).toBeLessThan(2500);
  });
  it('keeps normalization stopwords and bigrams/trigrams working', () => {
    const nlp = new NlpService();
    expect(nlp.normalizeText('  PYTHON,   y Scrum!  ')).toBe('python y scrum');
    expect(nlp.tokenizeAndFilter('python y scrum')).toEqual(['python', 'scrum']);
    expect(nlp.generateNGrams(['machine', 'learning', 'python'])).toEqual(['machine_learning', 'learning_python', 'machine_learning_python']);
    expect(nlp.generateNGrams([])).toEqual([]);
  });
  it('inserts and replaces tags in the same database write as the experience', async () => {
    const workExperience = { create: vi.fn().mockResolvedValue({ id: 'e' }), update: vi.fn().mockResolvedValue({ id: 'e' }) };
    const repository = new WorkExperienceRepository({ workExperience } as unknown as PrismaService, service);
    const startDate = new Date('2024-01-01');
    await repository.create('owner', { companyName: 'UMSS', position: 'Dev', startDate, endDate: null, isCurrent: true, description: 'Python PYTHON Scrum' });
    expect(workExperience.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ detectedSkills: ['Python', 'Scrum'] }) }));
    await repository.update('e', 'owner', { description: '' }, { startDate, endDate: null, isCurrent: true });
    expect(workExperience.update).toHaveBeenCalledWith(expect.objectContaining({ data: { description: '', detectedSkills: [] } }));
  });
});
