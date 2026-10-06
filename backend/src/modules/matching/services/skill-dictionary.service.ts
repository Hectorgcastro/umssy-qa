import { Injectable } from '@nestjs/common';
import {
  INSTITUTIONAL_TERMS,
  SKILL_DICTIONARY,
} from '../constants/skill-dictionary.constants.js';

@Injectable()
export class SkillDictionaryService {
  normalizeTerm(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  canonicalize(value: string): string {
    const term = this.normalizeTerm(value);
    const entry = SKILL_DICTIONARY.find(
      ({ name, aliases }) =>
        this.normalizeTerm(name) === term ||
        aliases.some((alias) => this.normalizeTerm(alias) === term),
    );
    return this.normalizeTerm(entry?.name ?? value);
  }

  protectedTokens(text: string): string[] {
    const normalized = this.normalizeTerm(text);
    return INSTITUTIONAL_TERMS.filter((term) =>
      this.contains(normalized, term),
    ).map((term) => term.replaceAll(' ', '_'));
  }

  contains(text: string, term: string): boolean {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(
      `(?<![\\p{L}\\p{N}_.+#])${escaped}(?![\\p{L}\\p{N}_+#])`,
      'u',
    ).test(text);
  }
}
