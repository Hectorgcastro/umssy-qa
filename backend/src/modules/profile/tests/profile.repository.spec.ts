import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { ProfileRepository } from '../repositories/profile.repository.js';

const userId = '11111111-1111-4111-8111-111111111111';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;
  let user: { findUnique: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    user = { findUnique: vi.fn() };
    repository = new ProfileRepository({ user } as unknown as PrismaService);
  });

  it('reads only the profile columns of the user with the city', async () => {
    user.findUnique.mockResolvedValue(null);

    await repository.findByUserId(userId);

    expect(user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        personalEmail: true,
        phone: true,
        headline: true,
        aboutMe: true,
        updatedAt: true,
        city: { select: { id: true, title: true } },
      },
    });
  });

  it('never selects the password or the file columns', async () => {
    user.findUnique.mockResolvedValue(null);

    await repository.findByUserId(userId);

    const [{ select }] = user.findUnique.mock.calls[0] as [{ select: object }];
    expect(select).not.toHaveProperty('password');
    expect(select).not.toHaveProperty('photoUrl');
    expect(select).not.toHaveProperty('cvPdfUrl');
  });

  it('returns the record found', async () => {
    const record = { id: userId, firstName: 'Valeria' };
    user.findUnique.mockResolvedValue(record);

    await expect(repository.findByUserId(userId)).resolves.toBe(record);
  });

  it('returns null when the user does not exist', async () => {
    user.findUnique.mockResolvedValue(null);

    await expect(repository.findByUserId(userId)).resolves.toBeNull();
  });
});
