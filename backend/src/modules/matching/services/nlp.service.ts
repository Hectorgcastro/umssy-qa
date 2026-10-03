import { Injectable } from '@nestjs/common';

@Injectable()
export class NlpService {
  tokenizeAndFilter(text: string): string[] {
    const stopwords = new Set([
      'a',
      'al',
      'con',
      'de',
      'del',
      'el',
      'en',
      'la',
      'las',
      'los',
      'para',
      'por',
      'un',
      'una',
      'y',
    ]);

    return text
      .split(/\s+/)
      .filter((word) => word.length > 0 && !stopwords.has(word));
  }
}

