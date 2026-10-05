import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessRequestsService } from '../services/access-requests.service.js';
import {
  AccessRequestNotEditableException,
  AccessRequestNotFoundException,
  DuplicateAccessRequestDataException,
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
  const repository = { createDraft: vi.fn(), findById: vi.fn(), findActiveDuplicates: vi.fn(), updateDraft: vi.fn() };
  const authService = { existsByEmail: vi.fn() };
  let service: AccessRequestsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new AccessRequestsService(repository as any, authService as any);
    authService.existsByEmail.mockResolvedValue(false);
    repository.findActiveDuplicates.mockResolvedValue([]);
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

  describe('duplicados', () => {
    const dto = { email: 'ana@umss.edu.bo', idCardNumber: '123', sisCode: '456' } as any;

    it('create no consulta excludeId y guarda si no hay duplicados', async () => {
      repository.createDraft.mockResolvedValue(row());

      await service.create(dto);

      expect(authService.existsByEmail).toHaveBeenCalledWith('ana@umss.edu.bo');
      expect(repository.findActiveDuplicates).toHaveBeenCalledWith({ ...dto, excludeId: undefined });
      expect(repository.createDraft).toHaveBeenCalled();
    });

    it('create responde 409 si el correo pertenece a una cuenta registrada', async () => {
      authService.existsByEmail.mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toMatchObject({ statusCode: 409, message: 'El correo ya está registrado' });
      expect(repository.createDraft).not.toHaveBeenCalled();
    });

    it('create responde 409 si el correo pertenece a una solicitud activa', async () => {
      repository.findActiveDuplicates.mockResolvedValue([{ email: 'ANA@umss.edu.bo', idCardNumber: '999', sisCode: '999' }]);

      await expect(service.create(dto)).rejects.toMatchObject({ message: 'El correo ya está registrado' });
    });

    it('create responde 409 si el C.I. está repetido', async () => {
      repository.findActiveDuplicates.mockResolvedValue([{ email: 'otro@umss.edu.bo', idCardNumber: '123', sisCode: '999' }]);

      await expect(service.create(dto)).rejects.toMatchObject({ message: 'El carnet de identidad ya está registrado' });
    });

    it('create responde 409 si el código SIS está repetido', async () => {
      repository.findActiveDuplicates.mockResolvedValue([{ email: 'otro@umss.edu.bo', idCardNumber: '999', sisCode: '456' }]);

      await expect(service.create(dto)).rejects.toMatchObject({ message: 'El código SIS ya está registrado' });
    });

    it('create lista todos los campos repetidos en orden correo, C.I., SIS', async () => {
      authService.existsByEmail.mockResolvedValue(true);
      repository.findActiveDuplicates.mockResolvedValue([
        { email: 'x@umss.edu.bo', idCardNumber: '123', sisCode: '999' },
        { email: 'y@umss.edu.bo', idCardNumber: '999', sisCode: '456' },
      ]);

      const error = await service.create(dto).catch((e) => e);

      expect(error).toBeInstanceOf(DuplicateAccessRequestDataException);
      expect(error.message).toBe('El correo, el carnet de identidad y el código SIS ya están registrados');
    });

    it('create con dos campos repetidos los une con "y"', async () => {
      repository.findActiveDuplicates.mockResolvedValue([{ email: 'x@umss.edu.bo', idCardNumber: '123', sisCode: '456' }]);

      await expect(service.create(dto)).rejects.toMatchObject({ message: 'El carnet de identidad y el código SIS ya están registrados' });
    });

    it('update excluye el propio id al buscar duplicados', async () => {
      repository.findById.mockResolvedValue(row());
      repository.updateDraft.mockResolvedValue(row());

      await service.update('id-1', { sisCode: '456' });

      expect(authService.existsByEmail).not.toHaveBeenCalled();
      expect(repository.findActiveDuplicates).toHaveBeenCalledWith({ sisCode: '456', excludeId: 'id-1' });
    });

    it('update responde 409 si otro dato ya existe', async () => {
      repository.findById.mockResolvedValue(row());
      authService.existsByEmail.mockResolvedValue(true);

      await expect(service.update('id-1', { email: 'ana@umss.edu.bo' })).rejects.toBeInstanceOf(DuplicateAccessRequestDataException);
      expect(repository.updateDraft).not.toHaveBeenCalled();
    });

    it('update no consulta duplicados si no llegan correo, C.I. ni SIS', async () => {
      repository.findById.mockResolvedValue(row());
      repository.updateDraft.mockResolvedValue(row());

      await service.update('id-1', { phone: '71234567' });

      expect(authService.existsByEmail).not.toHaveBeenCalled();
      expect(repository.findActiveDuplicates).not.toHaveBeenCalled();
    });

    it('update revisa 404 y "no editable" antes que los duplicados', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.update('id-1', { sisCode: '456' })).rejects.toBeInstanceOf(AccessRequestNotFoundException);

      repository.findById.mockResolvedValue(row({ status: { title: 'pending' } }));
      await expect(service.update('id-1', { sisCode: '456' })).rejects.toBeInstanceOf(AccessRequestNotEditableException);

      expect(repository.findActiveDuplicates).not.toHaveBeenCalled();
    });
  });
});
