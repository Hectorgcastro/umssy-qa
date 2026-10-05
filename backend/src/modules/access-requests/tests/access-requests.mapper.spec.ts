import { describe, expect, it } from 'vitest';
import { toAccessRequestResponse } from '../mappers/access-request.mapper.js';

describe('toAccessRequestResponse', () => {
  it('aplana el estado y formatea la fecha de nacimiento', () => {
    const createdAt = new Date('2026-10-05T10:00:00Z');
    const result = toAccessRequestResponse({
      id: 'id-1',
      firstName: 'Ana',
      lastName: 'Rojas',
      idCardNumber: '123',
      idCardIssuedIn: 'LP',
      sisCode: '456',
      email: 'ana@umss.edu.bo',
      phone: null,
      birthDate: new Date('2000-05-10T00:00:00Z'),
      entryYear: 2019,
      documentFileId: null,
      createdAt,
      updatedAt: createdAt,
      status: { title: 'draft' },
    });

    expect(result).toMatchObject({ id: 'id-1', birthDate: '2000-05-10', status: 'draft', phone: null, documentFileId: null });
    expect(result).not.toHaveProperty('documentFile');
  });
});
