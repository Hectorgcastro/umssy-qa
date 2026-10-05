import { describe, expect, it } from 'vitest';
import { nextRequestCode, requestCodePrefix, REQUEST_CODE_REGEX } from '../helpers/request-code.js';

describe('nextRequestCode', () => {
  it('el primer código del año es el 0001', () => {
    expect(nextRequestCode(2026, null)).toBe('SOL-2026-0001');
    expect(nextRequestCode(2026, undefined)).toBe('SOL-2026-0001');
  });

  it('suma uno al máximo existente y rellena con ceros', () => {
    expect(nextRequestCode(2026, 'SOL-2026-0001')).toBe('SOL-2026-0002');
    expect(nextRequestCode(2026, 'SOL-2026-0148')).toBe('SOL-2026-0149');
    expect(nextRequestCode(2026, 'SOL-2026-0999')).toBe('SOL-2026-1000');
  });

  it('un código de otro año o ilegible reinicia en 0001', () => {
    expect(nextRequestCode(2027, 'SOL-2026-0148')).toBe('SOL-2027-0001');
    expect(nextRequestCode(2026, 'SOL-2026-abcd')).toBe('SOL-2026-0001');
  });

  it('expone el prefijo y un patrón que acepta los códigos generados', () => {
    expect(requestCodePrefix(2026)).toBe('SOL-2026-');
    expect(REQUEST_CODE_REGEX.test(nextRequestCode(2026, 'SOL-2026-0009'))).toBe(true);
  });
});
