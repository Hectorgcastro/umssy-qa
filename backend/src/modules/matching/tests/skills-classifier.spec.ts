import { describe, expect, it } from 'vitest';
import { MatchingService } from '../services/matching.service.js';

describe('Skills classifier (#215)', () => {
  const service = new MatchingService();
  const detect = (text: string) => service.analyzeExperience({ experienceId: 'test', text }).skills.map(({ name }) => name);
  it('detects canonical technical skills once and protects punctuation', () => {
    expect(detect('PYTHON python, C++ C# .NET Node.js Scrum Machine Learning')).toEqual([
      'Python', 'C++', 'C#', '.NET', 'Node.js', 'Scrum', 'Machine Learning',
    ]);
  });
  it('rejects substrings, common adjectives and institutions as skills', () => {
    expect(detect('proactivo puntual UMSS San Simón javascriptista javabeans')).toEqual([]);
  });
  it('detects multiword accented aliases', () => {
    expect(detect('Aprendizaje automático y desarrollador web')).toEqual(['Machine Learning', 'Desarrollador Web']);
  });
});
