import { describe, expect, it, vi } from 'vitest';
import { BackofficeGuard } from '../guards/backoffice.guard.js';
import { ForbiddenRoleException, UnauthorizedSessionException } from '../exceptions/index.js';

function build(options: { payload?: unknown; verifyError?: boolean; user?: unknown } = {}) {
  const jwtService = {
    verifyAsync: options.verifyError
      ? vi.fn().mockRejectedValue(new Error('jwt expired'))
      : vi.fn().mockResolvedValue(options.payload ?? { sub: 'user-1', roleTag: 'administrativo' }),
  };
  const authService = { getSessionUser: vi.fn().mockResolvedValue('user' in options ? options.user : { id: 'user-1', email: 'admin@umss.test' }) };
  const guard = new BackofficeGuard(jwtService as any, authService as any);
  const run = (authorization?: string) => {
    const request: any = { headers: { authorization } };
    const context = { switchToHttp: () => ({ getRequest: () => request }) } as any;
    return { request, result: guard.canActivate(context) };
  };
  return { guard, jwtService, authService, run };
}

describe('BackofficeGuard', () => {
  it.each([undefined, '', 'Basic abc', 'token-sin-prefijo'])('sin token Bearer (%j) responde 401', async (header) => {
    const { run } = build();
    const { result } = run(header);
    await expect(result).rejects.toBeInstanceOf(UnauthorizedSessionException);
    await expect(result).rejects.toMatchObject({ statusCode: 401, message: 'Debes iniciar sesión para continuar' });
  });

  it('con un token inválido o expirado responde 401', async () => {
    const { run } = build({ verifyError: true });
    await expect(run('Bearer malo').result).rejects.toMatchObject({ statusCode: 401, message: 'La sesión no es válida o expiró' });
  });

  it.each([{ roleTag: 'administrativo' }, { sub: 'u1' }, { sub: 'u1', roleTag: 'inventado' }])('con un payload incompleto %j responde 401', async (payload) => {
    const { run } = build({ payload });
    await expect(run('Bearer t').result).rejects.toBeInstanceOf(UnauthorizedSessionException);
  });

  it.each(['titulado', 'estudiante', 'mentor', 'empresa'])('con el rol %s responde 403', async (roleTag) => {
    const { run, authService } = build({ payload: { sub: 'u1', roleTag } });
    const { result } = run('Bearer t');
    await expect(result).rejects.toBeInstanceOf(ForbiddenRoleException);
    await expect(result).rejects.toMatchObject({ statusCode: 403, message: 'No tienes permiso para realizar esta acción' });
    expect(authService.getSessionUser).not.toHaveBeenCalled();
  });

  it('responde 401 si el usuario del token ya no existe', async () => {
    const { run } = build({ user: null });
    await expect(run('Bearer t').result).rejects.toBeInstanceOf(UnauthorizedSessionException);
  });

  it('un administrativo pasa y deja request.user con id, correo y roles', async () => {
    const { run, jwtService } = build();
    const { request, result } = run('Bearer token-valido');

    await expect(result).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token-valido');
    expect(request.user).toEqual({ id: 'user-1', email: 'admin@umss.test', roles: ['administrativo'] });
  });
});
