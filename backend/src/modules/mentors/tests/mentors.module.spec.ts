import { describe, expect, it } from 'vitest';
import { MentorsModule } from '../mentors.module.js';

describe('MentorsModule', () => {
  it('debería estar definido', () => {
    expect(MentorsModule).toBeDefined();
  });
});