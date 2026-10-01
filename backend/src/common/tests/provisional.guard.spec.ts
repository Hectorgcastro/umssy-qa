import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { ROLES } from '../guards/roles.constants.js';
import { ProvisionalSessionGuard } from '../guards/provisional.guard.js';

// Evita cargar el cliente real de Prisma: el guard solo necesita el tipo.
vi.mock('../prisma/client', () => ({ PrismaService: class {} }));

const VALID_ID = '11111111-1111-4111-8111-111111111111';

type FakeRequest = {
  headers: Record<string, string | string[] | undefined>;
  user?: unknown;
};

function createContext(request: FakeRequest) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function createGuard(dbUser: unknown) {
  const findFirst = vi.fn().mockResolvedValue(dbUser);
  const prisma = { user: { findFirst } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guard = new ProvisionalSessionGuard(prisma as any);
  return { guard, findFirst };
}

describe('ProvisionalSessionGuard', () => {
  it('responde 401 si falta el header x-user-id', async () => {
    const { guard, findFirst } = createGuard(null);
    const ctx = createContext({ headers: {} });

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('responde 401 si el header llega repetido (arreglo)', async () => {
    const { guard, findFirst } = createGuard(null);
    const ctx = createContext({ headers: { 'x-user-id': [VALID_ID, VALID_ID] } });

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('responde 401 si x-user-id no es un UUID válido', async () => {
    const { guard, findFirst } = createGuard(null);
    const ctx = createContext({ headers: { 'x-user-id': 'no-es-uuid' } });

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('responde 401 si el usuario no existe o está inactivo', async () => {
    const { guard, findFirst } = createGuard(null);
    const ctx = createContext({ headers: { 'x-user-id': VALID_ID } });

    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(findFirst).toHaveBeenCalledOnce();
  });

  it('busca solo usuarios activos y roles vigentes', async () => {
    const { guard, findFirst } = createGuard(null);
    const ctx = createContext({ headers: { 'x-user-id': VALID_ID } });

    await guard.canActivate(ctx).catch(() => undefined);

    const args = findFirst.mock.calls[0][0];
    expect(args.where).toEqual({ id: VALID_ID, isActive: true });
    expect(args.select.roles.where.deletedAt).toBeNull();
  });

  it('deja pasar y carga request.user con sus roles', async () => {
    const { guard } = createGuard({
      id: VALID_ID,
      email: 'mentor@test.com',
      roles: [{ role: { name: ROLES.MENTOR } }],
    });
    const request: FakeRequest = { headers: { 'x-user-id': VALID_ID } };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(request.user).toEqual({
      id: VALID_ID,
      email: 'mentor@test.com',
      roles: [ROLES.MENTOR],
    });
  });
});