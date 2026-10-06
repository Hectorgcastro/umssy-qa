import { describe, expect, it, vi } from 'vitest';
import type { Prisma } from '../../../prisma/client.js';
import { seedUsers } from './users.seed.js';
function buildTransaction(hasRoles: boolean) {
  return {
    role: {
      upsert: vi.fn(),
      findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'titulado-role' }),
    },
    user: {
      upsert: vi
        .fn()
        .mockImplementation(({ where }) =>
          Promise.resolve({ id: where.email }),
        ),
    },
    userRole: {
      findFirst: vi
        .fn()
        .mockResolvedValue(hasRoles ? { id: 'existing-role' } : null),
      create: vi.fn(),
    },
  };
}
describe('seedUsers', () => {
  it('creates both QA users and assigns their role when absent', async () => {
    const tx = buildTransaction(false);
    const users = await seedUsers(
      tx as unknown as Prisma.TransactionClient,
      'hashed-password',
    );
    expect(users).toEqual({
      tituladoId: 'prueba@umss.edu.bo',
      emptyUserId: 'sinpases@umss.edu.bo',
    });
    expect(tx.userRole.create).toHaveBeenCalledTimes(2);
    expect(tx.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { password: 'hashed-password' } }),
    );
  });
  it('does not duplicate active roles when seeding existing users', async () => {
    const tx = buildTransaction(true);
    await seedUsers(
      tx as unknown as Prisma.TransactionClient,
      'hashed-password',
    );
    expect(tx.userRole.create).not.toHaveBeenCalled();
  });
  it('propagates database errors to roll back the coordinator transaction', async () => {
    const tx = buildTransaction(false);
    tx.user.upsert.mockRejectedValueOnce(new Error('Database unavailable'));
    await expect(
      seedUsers(tx as unknown as Prisma.TransactionClient, 'hashed-password'),
    ).rejects.toThrow('Database unavailable');
    expect(tx.userRole.create).not.toHaveBeenCalled();
  });
});
