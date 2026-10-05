import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessRequestsService } from '../services/access-requests.service.js';
import {
  AccessRequestNotEditableException,
  AccessRequestNotFoundException,
  InvalidEntryYearException,
} from '../exceptions/index.js';

function row(overrides: Record<string, unknown> = {}) {
  const now = new Date('2026-10-05T10:00:00Z');
  return {
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
    createdAt: now,
    updatedAt: now,
    status: { title: 'draft' },
    ...overrides,
  };
}

describe('AccessRequestsService', () => {
  const repository = { createDraft: vi.fn(), findById: vi.fn(), updateDraft: vi.fn() };
  let service: AccessRequestsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new AccessRequestsService(repository as any);
  });

  it('create devuelve solo el id del borrador', async () => {
    repository.createDraft.mockResolvedValue(row());

    const result = await service.create({ firstName: 'Ana' } as any);

    expect(result).toEqual({ id: 'id-1' });
    expect(repository.createDraft).toHaveBeenCalledWith({ firstName: 'Ana' });
  });

  it('update lanza 404 si la solicitud no existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.update('id-1', { phone: '71234567' })).rejects.toBeInstanceOf(AccessRequestNotFoundException);
    expect(repository.updateDraft).not.toHaveBeenCalled();
  });

  it('update lanza 409 si la solicitud ya fue enviada', async () => {
    repository.findById.mockResolvedValue(row({ status: { title: 'pending' } }));

    await expect(service.update('id-1', { phone: '71234567' })).rejects.toBeInstanceOf(AccessRequestNotEditableException);
    expect(repository.updateDraft).not.toHaveBeenCalled();
  });

  it('update guarda los cambios y devuelve la solicitud mapeada', async () => {
    repository.findById.mockResolvedValue(row());
    repository.updateDraft.mockResolvedValue(row({ phone: '71234567' }));

    const result = await service.update('id-1', { phone: '71234567' });

    expect(repository.updateDraft).toHaveBeenCalledWith('id-1', { phone: '71234567' });
    expect(result).toMatchObject({ id: 'id-1', phone: '71234567', status: 'draft', birthDate: '2000-05-10' });
  });

  it('update valida el año de ingreso nuevo contra la fecha de nacimiento guardada', async () => {
    repository.findById.mockResolvedValue(row());

    await expect(service.update('id-1', { entryYear: 2014 })).rejects.toBeInstanceOf(InvalidEntryYearException);
    expect(repository.updateDraft).not.toHaveBeenCalled();
  });

  it('update valida la fecha de nacimiento nueva contra el año de ingreso guardado', async () => {
    repository.findById.mockResolvedValue(row());

    await expect(service.update('id-1', { birthDate: new Date('2008-01-01T00:00:00Z') })).rejects.toBeInstanceOf(InvalidEntryYearException);
  });
});
