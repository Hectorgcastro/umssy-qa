import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { vi } from 'vitest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const prismaMock = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  event: { findMany: vi.fn().mockResolvedValue([]) },
  user: { findUnique: vi.fn() },
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        statusCode: 200,
        ok: true,
        detail: 'Operación exitosa',
        data: 'Hello World!',
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
