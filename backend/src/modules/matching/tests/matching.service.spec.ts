import { beforeEach, describe, expect, it } from 'vitest';
import { MatchingService } from '../services/matching.service.js';

const EXPERIENCE_ID = '5b1f0c3e-8a4d-4f0b-9a52-1d6c7e2a9b10';

describe('MatchingService', () => {
  let service: MatchingService;

  beforeEach(() => {
    service = new MatchingService();
  });

  it('devuelve el id de la experiencia y una lista de habilidades', () => {
    const result = service.analyzeExperience({
      experienceId: EXPERIENCE_ID,
      text: 'Trabaje como desarrollador backend usando Python y Django',
    });

    expect(result.experienceId).toBe(EXPERIENCE_ID);
    expect(Array.isArray(result.skills)).toBe(true);
  });

  it.each([[''], ['   '], [null], [undefined]])(
    'responde sin habilidades y sin error con texto vacio (%o)',
    (text) => {
      const result = service.analyzeExperience({ experienceId: EXPERIENCE_ID, text });

      expect(result.skills).toEqual([]);
    },
  );

  it('informa el tiempo de procesamiento como un numero entero no negativo', () => {
    const result = service.analyzeExperience({ experienceId: EXPERIENCE_ID, text: 'Scrum' });

    expect(Number.isInteger(result.processingTimeMs)).toBe(true);
    expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
  });
});
