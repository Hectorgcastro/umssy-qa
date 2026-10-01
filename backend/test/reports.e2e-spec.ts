import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('ReportsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /reports/registered-users devuelve la página con el formato estándar', async () => {
    const response = await request(app.getHttpServer())
      .get('/reports/registered-users')
      .query({ year: 2026, userType: 'graduate', limit: 5 })
      .expect(200);

    expect(response.body).toMatchObject({
      statusCode: 200,
      ok: true,
      page: 1,
      detail: 'Usuarios registrados obtenidos correctamente',
      data: { page: 1, limit: 5 },
    });
    expect(response.body.data.items).toHaveLength(5);
  });

  it('GET /reports/rejected-users devuelve solo rechazados', async () => {
    const response = await request(app.getHttpServer())
      .get('/reports/rejected-users')
      .expect(200);

    expect(response.body.data.total).toBeGreaterThan(0);
    for (const user of response.body.data.items) {
      expect(user.registrationStatus).toBe('rejected');
    }
  });

  it('responde 400 con el formato estándar si los filtros no son válidos', async () => {
    const response = await request(app.getHttpServer())
      .get('/reports/registered-users')
      .query({ userType: 'unknown' })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      data: null,
      ok: false,
    });
    expect(response.body.detail).toContain('userType');
  });
});
