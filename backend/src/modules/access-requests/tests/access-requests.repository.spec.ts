import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '../../../prisma/client.js';
import { AccessRequestsRepository } from '../repositories/access-requests.repository.js';
import { AccessRequestNotFoundException } from '../exceptions/index.js';

const dto = {
  firstName: 'Ana',
  lastName: 'Rojas',
  idCardNumber: '123',
  idCardIssuedIn: 'LP' as const,
  sisCode: '456',
  email: 'ana@umss.edu.bo',
  birthDate: new Date('2000-05-10T00:00:00Z'),
  entryYear: 2019,
};

function build() {
  const accessRequest = { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() };
  return { accessRequest, repository: new AccessRequestsRepository({ accessRequest } as any) };
}

describe('AccessRequestsRepository', () => {
  it('crea el borrador conectando el estado por título', async () => {
    const { accessRequest, repository } = build();
    accessRequest.create.mockResolvedValue({ id: 'id-1' });

    await repository.createDraft(dto);

    const args = accessRequest.create.mock.calls[0][0];
    expect(args.data.status).toEqual({ connect: { title: 'draft' } });
    expect(args.select).not.toHaveProperty('documentFile');
  });

  it('busca por id', async () => {
    const { accessRequest, repository } = build();
    accessRequest.findUnique.mockResolvedValue(null);

    await expect(repository.findById('id-1')).resolves.toBeNull();
    expect(accessRequest.findUnique.mock.calls[0][0].where).toEqual({ id: 'id-1' });
  });

  it('actualiza solo mientras el estado sea draft', async () => {
    const { accessRequest, repository } = build();
    accessRequest.update.mockResolvedValue({ id: 'id-1' });

    await repository.updateDraft('id-1', { phone: '71234567' });

    expect(accessRequest.update.mock.calls[0][0].where).toEqual({ id: 'id-1', status: { title: 'draft' } });
  });

  it('convierte P2025 en 404 de dominio', async () => {
    const { accessRequest, repository } = build();
    accessRequest.update.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('no record', { code: 'P2025', clientVersion: 'test' }));

    await expect(repository.updateDraft('id-1', { phone: '71234567' })).rejects.toBeInstanceOf(AccessRequestNotFoundException);
  });

  it('propaga cualquier otro error', async () => {
    const { accessRequest, repository } = build();
    const boom = new Error('db caída');
    accessRequest.update.mockRejectedValue(boom);

    await expect(repository.updateDraft('id-1', { phone: '71234567' })).rejects.toBe(boom);
  });
});
