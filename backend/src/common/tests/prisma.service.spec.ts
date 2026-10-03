import { beforeAll, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service.js';

beforeAll(() => {
  process.env.DATABASE_URL ??= 'postgresql://user:password@localhost:5432/test_db';
});

describe('PrismaService', () => {
  it('conecta y desconecta a traves de los hooks del ciclo de vida', async () => {
    const service = new PrismaService();
    const connectSpy = vi.spyOn(service, '$connect').mockResolvedValue(undefined);
    const disconnectSpy = vi.spyOn(service, '$disconnect').mockResolvedValue(undefined);

    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(connectSpy).toHaveBeenCalledOnce();
    expect(disconnectSpy).toHaveBeenCalledOnce();
  });
});