import type { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { MissingUserException } from '../exceptions/missing-user.exception.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.type.js';

const secret = 'test-secret';
const userId = '11111111-1111-4111-8111-111111111111';

const buildContext = (request: Partial<AuthenticatedRequest>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let jwtService: JwtService;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = new JwtService({ secret });
    guard = new JwtAuthGuard(jwtService);
  });

  it('attaches the user of a valid bearer token to the request', async () => {
    const token = jwtService.sign({ sub: userId, roleTag: 'titulado' });
    const request: Partial<AuthenticatedRequest> = {
      headers: { authorization: `Bearer ${token}` },
    };

    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);
    expect(request.user).toEqual({ userId, roleTag: 'titulado' });
  });

  it('rejects a request without the authorization header', async () => {
    await expect(guard.canActivate(buildContext({ headers: {} }))).rejects.toBeInstanceOf(
      MissingUserException,
    );
  });

  it.each(['Basic abc', 'Bearer ', 'token-without-scheme'])(
    'rejects the malformed header "%s"',
    async (authorization) => {
      await expect(
        guard.canActivate(buildContext({ headers: { authorization } })),
      ).rejects.toBeInstanceOf(MissingUserException);
    },
  );

  it('rejects a token signed with another secret', async () => {
    const token = new JwtService({ secret: 'other-secret' }).sign({ sub: userId });

    await expect(
      guard.canActivate(buildContext({ headers: { authorization: `Bearer ${token}` } })),
    ).rejects.toBeInstanceOf(InvalidTokenException);
  });

  it('rejects an expired token', async () => {
    const token = jwtService.sign({ sub: userId }, { expiresIn: -10 });

    await expect(
      guard.canActivate(buildContext({ headers: { authorization: `Bearer ${token}` } })),
    ).rejects.toThrow('Access token is invalid or expired');
  });
});
