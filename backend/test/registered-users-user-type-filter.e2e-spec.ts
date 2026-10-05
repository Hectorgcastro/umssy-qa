import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/common/prisma/prisma.service.js';
import { GeneratedReportsRepository } from './../src/modules/reports/repositories/generated-reports.repository.js';
import { ReportUsersRepository } from './../src/modules/reports/repositories/report-users.repository.js';
import type {
  ReportUser,
  ReportUserType,
} from './../src/modules/reports/types/report-user.types.js';

// HU02 (Épica 10): contrato HTTP del filtro por tipo de usuario.
// Los repositorios con Prisma se reemplazan por datos en memoria para probar solo la capa HTTP.

const SAME_DATE = '2026-04-01T12:00:00.000Z';

function buildUsers(userType: ReportUserType, count: number): ReportUser[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${userType.toLowerCase()}-${String(index).padStart(2, '0')}`,
    fullName: `Usuario ${userType} ${index}`,
    email: `${userType.toLowerCase()}.${index}@example.com`,
    userType,
    identifier: `ID-${index}`,
    documentType: 'ACADEMIC_DEGREE',
    registeredAt: SAME_DATE,
    registrationStatus: 'APPROVED',
    rejectionReason: null,
  }));
}

const USERS: ReportUser[] = [
  ...buildUsers('STUDENT', 10),
  ...buildUsers('ADMIN', 11),
  ...buildUsers('MENTOR', 3),
];

describe('GET /reports/registered-users con filtro por tipo de usuario (e2e)', () => {
  let app: INestApplication<App>;

  const getRegisteredUsers = (query: Record<string, unknown> | string) =>
    request(app.getHttpServer()).get('/reports/registered-users').query(query);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(ReportUsersRepository)
      .useValue({ findAll: () => USERS })
      .overrideProvider(GeneratedReportsRepository)
      .useValue({ findAll: () => [], create: (report: unknown) => report })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([{}, { userType: 'ALL' }])(
    'sin filtro o con "Todos" devuelve todos los tipos (%o)',
    async (query) => {
      const response = await getRegisteredUsers(query).expect(200);

      expect(response.body.data).toMatchObject({
        totalItems: 24,
        totalPages: 3,
        page: 1,
        limit: 10,
      });
    },
  );

  it('expone en cada fila el id y los 6 campos del reporte', async () => {
    const response = await getRegisteredUsers({ userType: 'MENTOR' }).expect(
      200,
    );

    for (const user of response.body.data.items) {
      expect(Object.keys(user).sort()).toEqual(
        [
          'documentType',
          'email',
          'fullName',
          'id',
          'identifier',
          'registeredAt',
          'userType',
        ].sort(),
      );
    }
  });

  it('con 10 registros de un tipo responde una sola página', async () => {
    const response = await getRegisteredUsers({ userType: 'STUDENT' }).expect(
      200,
    );

    expect(response.body.data).toMatchObject({
      totalItems: 10,
      totalPages: 1,
    });
    expect(response.body.data.items).toHaveLength(10);
  });

  it('con 11 registros la página 2 trae 1 registro del mismo tipo', async () => {
    const response = await getRegisteredUsers({
      userType: 'ADMIN',
      page: 2,
    }).expect(200);

    expect(response.body.data).toMatchObject({ totalItems: 11, totalPages: 2 });
    expect(response.body.data.items).toHaveLength(1);
    expect(response.body.data.items[0].userType).toBe('ADMIN');
  });

  it('recorrer las páginas no repite ni omite usuarios con la misma fecha', async () => {
    const pages = await Promise.all(
      [1, 2].map((page) =>
        getRegisteredUsers({ userType: 'ADMIN', page }).expect(200),
      ),
    );
    const ids = pages.flatMap((response) =>
      response.body.data.items.map((user: { id: string }) => user.id),
    );

    expect(new Set(ids).size).toBe(11);
  });

  it('combina la gestión con el tipo de usuario (HU07)', async () => {
    const response = await getRegisteredUsers({
      period: 'I-2026',
      userType: 'ADMIN',
      page: 2,
    }).expect(200);

    expect(response.body.data).toMatchObject({ totalItems: 11, totalPages: 2 });
    expect(response.body.data.items).toHaveLength(1);
  });

  it('una gestión sin registros responde lista vacía (HU07)', async () => {
    const response = await getRegisteredUsers({ period: 'II-2026' }).expect(
      200,
    );

    expect(response.body.data).toMatchObject({
      items: [],
      totalItems: 0,
      totalPages: 0,
    });
  });

  it('un tipo sin registros responde lista vacía y totales en 0', async () => {
    const response = await getRegisteredUsers({ userType: 'COMPANY' }).expect(
      200,
    );

    expect(response.body.data).toMatchObject({
      items: [],
      totalItems: 0,
      totalPages: 0,
    });
  });

  it('una página fuera de rango responde vacía sin perder los totales', async () => {
    const response = await getRegisteredUsers({
      userType: 'MENTOR',
      page: 99,
    }).expect(200);

    expect(response.body.data).toMatchObject({
      items: [],
      totalItems: 3,
      totalPages: 1,
      page: 99,
    });
  });

  describe('responde 400 con el formato estándar ante entradas inválidas', () => {
    it.each([
      {
        case: 'gestión numérica antigua',
        query: { period: '1-2026' },
        field: 'period',
      },
      {
        case: 'gestión inexistente',
        query: { period: 'III-2026' },
        field: 'period',
      },
      {
        case: 'gestión anterior a 2020',
        query: { period: 'I-2019' },
        field: 'period',
      },
      {
        case: 'gestión con inyección SQL',
        query: { period: "I-2026' OR '1'='1" },
        field: 'period',
      },
      {
        case: 'tipo inexistente',
        query: { userType: 'ALUMNI' },
        field: 'userType',
      },
      {
        case: 'Egresado (rol fuera del reporte)',
        query: { userType: 'Egresado' },
        field: 'userType',
      },
      {
        case: 'GRADUATE (código eliminado)',
        query: { userType: 'GRADUATE' },
        field: 'userType',
      },
      {
        case: 'etiqueta en español',
        query: { userType: 'Estudiante' },
        field: 'userType',
      },
      {
        case: 'código en minúsculas',
        query: { userType: 'student' },
        field: 'userType',
      },
      { case: 'tipo vacío', query: { userType: '' }, field: 'userType' },
      {
        case: 'inyección SQL',
        query: { userType: "STUDENT' OR '1'='1" },
        field: 'userType',
      },
      {
        case: 'etiqueta HTML',
        query: { userType: '<script>alert(1)</script>' },
        field: 'userType',
      },
      {
        case: 'caracteres especiales',
        query: { userType: 'ÁÉÍ%$#@!' },
        field: 'userType',
      },
      {
        case: 'varios tipos a la vez',
        query: 'userType=STUDENT&userType=ADMIN',
        field: 'userType',
      },
      { case: 'página negativa', query: { page: -1 }, field: 'page' },
      { case: 'página cero', query: { page: 0 }, field: 'page' },
      { case: 'página decimal', query: { page: 1.5 }, field: 'page' },
      { case: 'página como texto', query: { page: 'abc' }, field: 'page' },
      { case: 'límite negativo', query: { limit: -10 }, field: 'limit' },
      { case: 'límite cero', query: { limit: 0 }, field: 'limit' },
      { case: 'límite como texto', query: { limit: 'diez' }, field: 'limit' },
      { case: 'límite mayor a 10', query: { limit: 11 }, field: 'limit' },
      { case: 'límite enorme', query: { limit: 1e9 }, field: 'limit' },
    ])('$case', async ({ query, field }) => {
      const response = await getRegisteredUsers(query).expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        data: null,
        ok: false,
      });
      expect(response.body.detail).toContain(field);
    });
  });
});
