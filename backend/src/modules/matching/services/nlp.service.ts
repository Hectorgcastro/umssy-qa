import { Injectable } from '@nestjs/common';

@Injectable()
export class NlpService {
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}



