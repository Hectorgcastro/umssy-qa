import { Injectable } from '@nestjs/common';
import { SKILL_DICTIONARY } from '../constants/skill-dictionary.constants.js';
import { SkillDictionaryService } from './skill-dictionary.service.js';
import { NlpService } from './nlp.service.js';
import type {
  AnalyzeExperienceInput,
  AnalyzeExperienceResponse,
  DetectedSkillResponse,
} from '../types/matching.types.js';

@Injectable()
export class MatchingService {
  constructor(
    private readonly dictionary: SkillDictionaryService = new SkillDictionaryService(),
    private readonly nlp: NlpService = new NlpService(),
  ) {}
  // Punto de entrada del analisis de habilidades de una experiencia laboral (HU-01)
  analyzeExperience(input: AnalyzeExperienceInput): AnalyzeExperienceResponse {
    const startedAt = performance.now();

    // input.text puede ser vacio o nulo (AC-01.9): en ese caso no hay nada que detectar.
    // Pipeline NLP, cada paso lo implementa su responsable:
    //   T1.2 normalizacion -> T1.3/T1.4 tokenizacion -> T1.5 n-gramas -> T1.6 clasificacion
    // Por ahora el texto aun no se procesa, asi que no se detecta ninguna habilidad.
    const text = this.dictionary.normalizeTerm(input.text ?? '');
    const tokens = this.nlp.tokenizeAndFilter(this.nlp.normalizeText(text));
    const candidates = new Set([...tokens, ...this.nlp.generateNGrams(tokens), ...this.dictionary.protectedTokens(text)]);
    const skills: DetectedSkillResponse[] = SKILL_DICTIONARY.filter(({ aliases }) =>
      aliases.some((alias) => candidates.has(alias.replaceAll(' ', '_')) || this.dictionary.contains(text, alias)),
    ).map(({ name }) => ({ id: this.dictionary.canonicalize(name), name }));

    return {
      experienceId: input.experienceId,
      skills,
      processingTimeMs: Math.round(performance.now() - startedAt),
    };
  }
}
