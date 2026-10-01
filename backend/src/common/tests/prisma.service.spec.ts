import { describe, expect, it, vi } from 'vitest';

// Se simula el cliente generado y el adapter: así no se abre ninguna conexión real.
vi.mock('../../prisma/client', () => ({
  PrismaClient: class {
    options: unknown;
    $connect = vi.fn().mockResolvedValue(undefined);
    $disconnect = vi.fn().mockResolvedValue(undefined);
    constructor(options: unknown) {
      this.options = options;
    }
  },
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: class {
    config: unknown;
    constructor(config: unknown) {
      this.config = config;
    }
  },
}));

import { PrismaService } from '../prisma.service.js';

describe('PrismaService', () => {
  it('crea el cliente con el adapter de PostgreSQL', () => {
    const service = new PrismaService();
    const options = (service as unknown as { options: { adapter: unknown } })
      .options;

    expect(options.adapter).toBeDefined();
  });

  it('se conecta al iniciar el módulo', async () => {
    const service = new PrismaService();

    await service.onModuleInit();

    expect(service.$connect).toHaveBeenCalledOnce();
  });

  it('se desconecta al destruir el módulo', async () => {
    const service = new PrismaService();

    await service.onModuleDestroy();

    expect(service.$disconnect).toHaveBeenCalledOnce();
  });
});