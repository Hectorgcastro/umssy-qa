import { describe, expect, it, vi } from 'vitest';
import { MatchingController } from '../controllers/matching.controller.js';
import type { ExperienceAnalysisService } from '../services/experience-analysis.service.js';

const EXPERIENCE_ID = '5b1f0c3e-8a4d-4f0b-9a52-1d6c7e2a9b10';

describe('MatchingController', () => {
  // CORRECCIÓN: Se agrega la palabra clave async antes de los paréntesis del examen
  it('delega el analisis al servicio con el id de la ruta y el texto del body', async () => {
    const response = { experienceId: EXPERIENCE_ID, skills: [], processingTimeMs: 3 };
    const matchingService = { analyze: vi.fn().mockReturnValue(response) };
    const controller = new MatchingController(matchingService as unknown as ExperienceAnalysisService);

    // CORRECCIÓN: Se agrega la palabra clave await en la ejecución de la promesa
    const result = await controller.analyzeExperience('owner', { id: EXPERIENCE_ID }, { text: 'Python y Django' });

    expect(matchingService.analyze).toHaveBeenCalledWith('owner', {
      experienceId: EXPERIENCE_ID,
      text: 'Python y Django',
    });
    expect(result).toEqual(response);
  });

  // CORRECCIÓN: Se agrega la palabra clave async antes de los paréntesis del examen
  it('pasa el texto nulo al servicio sin modificarlo', async () => {
    const matchingService = {
      analyze: vi
        .fn()
        .mockReturnValue({ experienceId: EXPERIENCE_ID, skills: [], processingTimeMs: 0 }),
    };
    const controller = new MatchingController(matchingService as unknown as ExperienceAnalysisService);

    // CORRECCIÓN: Se agrega la palabra clave await en la ejecución de la promesa
    await controller.analyzeExperience('owner', { id: EXPERIENCE_ID }, { text: null });

    expect(matchingService.analyze).toHaveBeenCalledWith('owner', {
      experienceId: EXPERIENCE_ID,
      text: null,
    });
  });
});
