import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from '../src/app.module.js';
import { runSeed } from '../src/common/database/seeds.js';
import { PrismaService } from '../src/common/prisma/prisma.service.js';
import { SEED_USERS, SEED_PASSWORD } from '../src/modules/users/constants/seed-users.constants.js';
import { getWeeks } from '../src/modules/availability/seeds/availability.seed.js';
import { MentorNotFoundException } from '../src/modules/availability/exceptions/mentor-not-found.exception.js';
import type { SeedBlockPlan } from '../src/modules/availability/types/seed-block-plan.types.js';
import type { SeedUserKey } from '../src/modules/users/types/seed-user-key.types.js';
import type { SeedWeekRange } from '../src/modules/availability/types/seed-week-range.types.js';
import type { SeedWeeks } from '../src/modules/availability/types/seed-weeks.types.js';

const MAX_RESPONSE_MS = 3000;

const MENTOR_NOT_FOUND_BODY = {
  statusCode: 404,
  data: null,
  detail: new MentorNotFoundException().message,
  ok: false,
};

const FREE_BLOCK_FIELDS = ['createdAt', 'endAt', 'id', 'mentorId', 'startAt', 'state', 'updatedAt'];

const seedUserOf = (key: SeedUserKey) => {
  const user = SEED_USERS.find((candidate) => candidate.key === key);
  if (!user) {
    throw new Error(`El seed de usuarios no define la clave "${key}"`);
  }
  return user;
};

describe('GET /mentors/:id/free-blocks (horarios libres) - H4-E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let weeks: SeedWeeks = getWeeks(new Date());
  let plan: SeedBlockPlan;
  let mentorAId: string;
  let mentorBId: string;
  let graduatedToken: string;
  let mentorAToken: string;
  let expectedFreeBlocksNextWeek = 0;

  const freeBlocksQuery = (week: SeedWeekRange) => ({
    from: week.start.toISOString(),
    to: week.end.toISOString(),
  });

  const getFreeBlocks = (mentorId: string, token: string, week: SeedWeekRange) =>
    request(app.getHttpServer())
      .get(`/mentors/${mentorId}/free-blocks`)
      .set('Authorization', `Bearer ${token}`)
      .query(freeBlocksQuery(week));

  const loginAs = async (key: SeedUserKey) => {
    const user = seedUserOf(key);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: SEED_PASSWORD, roleTag: user.role });

    expect(res.status).toBe(201);
    return res.body.accessToken as string;
  };

  const idOfSeedUser = async (key: SeedUserKey) => {
    const user = await prisma.user.findUnique({ where: { email: seedUserOf(key).email } });
    if (!user) {
      throw new Error(`El seed no creó al usuario "${key}" en el esquema que lee la app`);
    }
    return user.id;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Los DTOs de esta ruta se validan con el pipe global que registra main.ts.
    // Sin replicarlo, el e2e aceptaría consultas que producción rechaza.
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    // Se siembra con el PrismaService de la app (PrismaModule es global) para que
    // el endpoint lea exactamente los datos del seed, sin depender de DB_SCHEMA.
    prisma = app.get(PrismaService);

    const summary = await runSeed(prisma);
    weeks = summary.weeks;
    plan = summary.plan;

    // Los bloques con cita pendiente o confirmada no son horarios libres, aunque
    // estén dentro de la semana consultada.
    const occupiedStarts = new Set([plan.pending.start.getTime(), plan.confirmed.start.getTime()]);
    expectedFreeBlocksNextWeek = plan.blocks.filter(
      (block) =>
        block.start >= weeks.next.start &&
        block.start < weeks.next.end &&
        !occupiedStarts.has(block.start.getTime()),
    ).length;

    mentorAId = await idOfSeedUser('mentorA');
    mentorBId = await idOfSeedUser('mentorB');
    graduatedToken = await loginAs('graduate');
    mentorAToken = await loginAs('mentorA');
  });

  afterAll(async () => {
    // app.close() desconecta el PrismaService que se usó para el seed.
    await app.close();
  });

  describe('Semana con horarios libres (mentorA)', () => {
    it('devuelve 200 y lista los bloques libres de la semana siguiente', async () => {
      const res = await getFreeBlocks(mentorAId, graduatedToken, weeks.next);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(expectedFreeBlocksNextWeek).toBeGreaterThan(0);
      expect(res.body).toHaveLength(expectedFreeBlocksNextWeek);
      expect(res.body.every((block) => block.state === 'free')).toBe(true);
      expect(res.body.every((block) => block.mentorId === mentorAId)).toBe(true);
    });

    it('devuelve cada bloque con la estructura de la HU-04', async () => {
      const res = await getFreeBlocks(mentorAId, graduatedToken, weeks.next);

      expect(res.status).toBe(200);
      expect(Object.keys(res.body[0]).sort()).toEqual(FREE_BLOCK_FIELDS);
      expect(res.body[0]).toMatchObject({
        id: expect.any(String),
        mentorId: mentorAId,
        startAt: expect.any(String),
        endAt: expect.any(String),
        state: 'free',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('Semana con citas activas (CA2)', () => {
    it('incluye el bloque libre del trío del seed', async () => {
      const res = await getFreeBlocks(mentorAId, graduatedToken, plan.trioWeek);

      expect(res.status).toBe(200);
      expect(res.body.map((block) => block.startAt)).toContain(plan.free.start.toISOString());
    });

    it('excluye los bloques con cita pendiente y confirmada', async () => {
      const res = await getFreeBlocks(mentorAId, graduatedToken, plan.trioWeek);

      expect(res.status).toBe(200);
      const starts = res.body.map((block) => block.startAt);
      // El trío siempre queda en el futuro, así que su ausencia en la respuesta
      // se debe al filtro de citas activas y no al filtro de bloques pasados.
      expect(plan.pending.start.getTime()).toBeGreaterThan(Date.now());
      expect(starts).not.toContain(plan.pending.start.toISOString());
      expect(starts).not.toContain(plan.confirmed.start.toISOString());
    });
  });

  describe('Bloques pasados (CA3)', () => {
    it('devuelve 200 con un array vacío para una semana ya transcurrida', async () => {
      const res = await getFreeBlocks(mentorAId, graduatedToken, weeks.previous);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('no devuelve bloques anteriores al momento de la consulta', async () => {
      const now = new Date();
      const res = await getFreeBlocks(mentorAId, graduatedToken, weeks.current);

      expect(res.status).toBe(200);
      expect(res.body.every((block) => new Date(block.startAt).getTime() >= now.getTime())).toBe(true);

      if (plan.past) {
        expect(res.body.map((block) => block.startAt)).not.toContain(plan.past.start.toISOString());
      }
    });
  });

  describe('Mentor inexistente', () => {
    it('devuelve 404 con el detalle del dominio', async () => {
      const res = await getFreeBlocks(randomUUID(), graduatedToken, weeks.next);

      expect(res.status).toBe(404);
      expect(res.body).toEqual(MENTOR_NOT_FOUND_BODY);
    });
  });

  describe('Mentor sin bloques (mentorB)', () => {
    it('devuelve 200 con un array vacío', async () => {
      const res = await getFreeBlocks(mentorBId, graduatedToken, weeks.next);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('Control de acceso', () => {
    it('devuelve 401 sin token', async () => {
      const res = await request(app.getHttpServer())
        .get(`/mentors/${mentorAId}/free-blocks`)
        .query(freeBlocksQuery(weeks.next));

      expect(res.status).toBe(401);
    });

    it('devuelve 403 si el usuario no tiene el rol titular', async () => {
      const res = await getFreeBlocks(mentorAId, mentorAToken, weeks.next);

      expect(res.status).toBe(403);
    });
  });

  describe('Rendimiento (CA6)', () => {
    it(`responde los horarios libres en menos de ${MAX_RESPONSE_MS} ms`, async () => {
      const start = Date.now();
      const res = await getFreeBlocks(mentorAId, graduatedToken, weeks.next);
      const duration = Date.now() - start;

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(expectedFreeBlocksNextWeek);
      expect(duration).toBeLessThan(MAX_RESPONSE_MS);
    });
  });
});