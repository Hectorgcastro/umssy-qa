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
      .query({ period: 'I-2025', userType: 'DEGREE_HOLDER', limit: 5 })
      .expect(200);

    expect(response.body).toMatchObject({
      statusCode: 200,
      ok: true,
      page: 1,
      detail: 'Usuarios registrados obtenidos correctamente',
      data: { page: 1, limit: 5 },
    });
    expect(response.body.data.items.length).toBeLessThanOrEqual(5);
    for (const user of response.body.data.items) {
      expect(user.userType).toBe('DEGREE_HOLDER');
    }
  });

  it('GET /reports/registered-users/export descarga el CSV con los filtros aplicados', async () => {
    const { body: page } = await request(app.getHttpServer())
      .get('/reports/registered-users')
      .query({ userType: 'COMPANY' })
      .expect(200);
    const response = await request(app.getHttpServer())
      .get('/reports/registered-users/export')
      .query({ userType: 'COMPANY' })
      .responseType('blob')
      .expect(200);
    const content = (response.body as Buffer).toString('utf-8');

    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.headers['content-disposition']).toMatch(
      /^attachment; filename="usuarios-registrados-empresa-todos\.csv"$/,
    );

    // trim() también quitaría el BOM, por eso solo se descarta la última línea vacía.
    const [header, ...rows] = content.split('\r\n').slice(0, -1);
    expect(header).toBe(
      '\uFEFFUsuario,Correo,Tipo de Usuario,Identificador,Documento,Fecha de Registro',
    );
    // El CSV trae todos los usuarios del filtro, no solo los de la primera página.
    expect(rows).toHaveLength(page.data.totalItems);
  });

  it('GET /reports/rejected-users devuelve solo rechazados con su motivo', async () => {
    const response = await request(app.getHttpServer())
      .get('/reports/rejected-users')
      .expect(200);

    expect(response.body.data.items.length).toBeLessThanOrEqual(10);
    for (const user of response.body.data.items) {
      expect(user).toHaveProperty('rejectionReason');
      expect(user).not.toHaveProperty('registrationStatus');
    }
  });

  it('GET /reports/rejected-users/export descarga el CSV de rechazados', async () => {
    const { body: page } = await request(app.getHttpServer())
      .get('/reports/rejected-users')
      .expect(200);
    const response = await request(app.getHttpServer())
      .get('/reports/rejected-users/export')
      .responseType('blob')
      .expect(200);
    const content = (response.body as Buffer).toString('utf-8');

    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.headers['content-disposition']).toMatch(
      /^attachment; filename="usuarios-rechazados-\d{4}-\d{2}-\d{2}\.csv"$/,
    );

    const [header, ...rows] = content.split('\r\n').slice(0, -1);
    expect(header).toBe(
      '\uFEFFUsuario,Correo,Identificador,Documento,Fecha de Registro',
    );
    expect(rows).toHaveLength(page.data.totalItems);
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
