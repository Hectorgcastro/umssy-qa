import { describe, expect, it } from 'vitest';
import { SkillDictionaryService } from '../services/skill-dictionary.service.js';

describe('UMSS dictionary (#223)', () => {
  const dictionary = new SkillDictionaryService();
  it('preserves institutional phrases without treating them as a degree', () => {
    expect(dictionary.protectedTokens('Universidad Mayor de San Simón UMSS')).toContain('universidad_mayor_de_san_simon');
    expect(dictionary.canonicalize('Ingeniería de Sistemas')).not.toBe(dictionary.canonicalize('UMSS'));
  });
  it('normalizes aliases and accents', () => {
    expect(dictionary.canonicalize(' JS ')).toBe('javascript');
    expect(dictionary.canonicalize('Aprendizaje Automático')).toBe('machine learning');
  });
});
