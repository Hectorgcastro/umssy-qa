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
  analyzeExperience(input: AnalyzeExperienceInput): AnalyzeExperienceResponse {
    const startedAt = performance.now();

    const text = this.dictionary.normalizeTerm(input.text ?? '');
    const tokens = this.nlp.tokenizeAndFilter(this.nlp.normalizeText(text));
    const candidates = new Set([
      ...tokens,
      ...this.nlp.generateNGrams(tokens),
      ...this.dictionary.protectedTokens(text),
    ]);
    const skills: DetectedSkillResponse[] = SKILL_DICTIONARY.filter(
      ({ aliases }) =>
        aliases.some(
          (alias) =>
            candidates.has(alias.replaceAll(' ', '_')) ||
            this.dictionary.contains(text, alias),
        ),
    ).map(({ name }) => ({ id: this.dictionary.canonicalize(name), name }));

    return {
      experienceId: input.experienceId,
      skills,
      processingTimeMs: Math.round(performance.now() - startedAt),
    };
  }
}
