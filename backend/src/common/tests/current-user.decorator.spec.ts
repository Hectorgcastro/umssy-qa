import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { getCurrentUser } from '../decorators/current-user.decorator.js';
import { UnauthorizedSessionException } from '../exceptions/unauthorized-session.exception.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.types.js';
import type { AuthenticatedUser } from '../types/authenticated-user.types.js';

function createContext(user?: AuthenticatedUser): ExecutionContext {
  const request = { headers: {}, user } as AuthenticatedRequest;

  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('getCurrentUser', () => {
  it('devuelve el usuario autenticado de request.user', () => {
    const user: AuthenticatedUser = {
      id: '11111111-1111-4111-8111-111111111111',
    };

    expect(getCurrentUser(undefined, createContext(user))).toBe(user);
  });

  it('falla si request.user no existe', () => {
    expect(() => getCurrentUser(undefined, createContext())).toThrow(
      UnauthorizedSessionException,
    );
  });
});
