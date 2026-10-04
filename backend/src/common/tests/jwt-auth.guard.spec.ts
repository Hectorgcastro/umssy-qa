import type { ExecutionContext } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedSessionException } from '../exceptions/unauthorized-session.exception.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.types.js';
import type { LoginJwtPayload } from '../types/login-jwt-payload.types.js';

const USER_ID = '11111111-1111-4111-8111-111111111111';
const VALID_TOKEN = 'valid.jwt.token';
const VALID_PAYLOAD: LoginJwtPayload = { sub: USER_ID, roleTag: 'mentor' };

function createContext(request: AuthenticatedRequest): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function createRequest(authorization?: string): AuthenticatedRequest {
  return {
    headers: authorization === undefined ? {} : { authorization },
  } as AuthenticatedRequest;
}

function createGuard() {
  const verifyAsync = vi.fn<(token: string) => Promise<LoginJwtPayload>>();
  const jwtService = { verifyAsync } as unknown as JwtService;

  return { guard: new JwtAuthGuard(jwtService), verifyAsync };
}

describe('JwtAuthGuard', () => {
  it('rechaza requests sin Authorization', async () => {
    const { guard, verifyAsync } = createGuard();

    await expect(
      guard.canActivate(createContext(createRequest())),
    ).rejects.toMatchObject({ statusCode: 401 });
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza headers sin prefijo Bearer', async () => {
    const { guard, verifyAsync } = createGuard();

    await expect(
      guard.canActivate(createContext(createRequest(VALID_TOKEN))),
    ).rejects.toBeInstanceOf(UnauthorizedSessionException);
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza Bearer sin token', async () => {
    const { guard, verifyAsync } = createGuard();

    await expect(
      guard.canActivate(createContext(createRequest('Bearer '))),
    ).rejects.toBeInstanceOf(UnauthorizedSessionException);
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it.each(['token inválido', 'token expirado'])('rechaza un %s', async () => {
    const { guard, verifyAsync } = createGuard();
    verifyAsync.mockRejectedValue(new Error('jwt verification failed'));

    await expect(
      guard.canActivate(createContext(createRequest(`Bearer ${VALID_TOKEN}`))),
    ).rejects.toBeInstanceOf(UnauthorizedSessionException);
  });

  it.each([undefined, null, '', '   ', 123])(
    'rechaza payload con sub inválido: %s',
    async (sub) => {
      const { guard, verifyAsync } = createGuard();
      verifyAsync.mockResolvedValue({
        sub,
        roleTag: 'mentor',
      } as unknown as LoginJwtPayload);

      await expect(
        guard.canActivate(
          createContext(createRequest(`Bearer ${VALID_TOKEN}`)),
        ),
      ).rejects.toBeInstanceOf(UnauthorizedSessionException);
    },
  );

  it('verifica el JWT, permite el request y carga request.user', async () => {
    const { guard, verifyAsync } = createGuard();
    const request = createRequest(`Bearer ${VALID_TOKEN}`);
    verifyAsync.mockResolvedValue(VALID_PAYLOAD);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(verifyAsync).toHaveBeenCalledOnce();
    expect(verifyAsync).toHaveBeenCalledWith(VALID_TOKEN);
    expect(request.user).toEqual({ id: USER_ID });
  });
});
