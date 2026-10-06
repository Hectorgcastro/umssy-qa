import { describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../repositories/auth.repository.js';
import { AuthService } from '../services/auth.service.js';

describe('usuario de la sesión', () => {
  it('el repository busca solo id y correo por id', async () => {
    const user = { findUnique: vi.fn().mockResolvedValue({ id: 'u1', email: 'a@b.co' }) };
    const repository = new AuthRepository({ user } as any);

    await expect(repository.findSessionUser('u1')).resolves.toEqual({ id: 'u1', email: 'a@b.co' });
    expect(user.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' }, select: { id: true, email: true } });
  });

  it('el service delega en el repository', async () => {
    const authRepository = { findSessionUser: vi.fn().mockResolvedValue(null) };
    const service = new AuthService(authRepository as any, {} as any);

    await expect(service.getSessionUser('u1')).resolves.toBeNull();
    expect(authRepository.findSessionUser).toHaveBeenCalledWith('u1');
  });
});
