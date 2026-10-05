import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import { createSeedClient, runSeed } from '../src/common/database/seeds.js';
import { SEED_USERS, SEED_PASSWORD } from '../src/modules/users/constants/seed-users.constants.js';
import { getWeeks } from '../src/modules/availability/seeds/availability.seed.js';
import { MAX_WEEK_QUERY_MS } from '../src/modules/availability/constants/week-query.constants.js';
import type { PrismaClient } from '../src/prisma/client.js';

const MAX_RESPONSE_MS = 3000;

const seedUserOf = (key: (typeof SEED_USERS)[number]['key']) =>
  SEED_USERS.find((user) => user.key === key);

describe('GET /availability-blocks (mis bloques) - H2-E', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let mentorAToken: string;
  let mentorBToken: string;
  let weeks = getWeeks(new Date());
  let expectedBlocks = 0;

  const getMyBlocks = (token: string, from: string, to: string) =>
    request(app.getHttpServer())
      .get('/availability-blocks')
      .set('Authorization', `Bearer ${token}`)
      .query({ from, to });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = createSeedClient();
    const summary = await runSeed(prisma);
    weeks = summary.weeks;
    expectedBlocks = summary.plan.blocks.filter(
      (block) => block.start >= weeks.next.start && block.start < weeks.next.end,
    ).length;

    const loginMentorA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: seedUserOf('mentorA')?.email,
        password: SEED_PASSWORD,
        roleTag: seedUserOf('mentorA')?.role,
      });
    mentorAToken = loginMentorA.body.accessToken;

    const loginMentorB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: seedUserOf('mentorB')?.email,
        password: SEED_PASSWORD,
        roleTag: seedUserOf('mentorB')?.role,
      });
    mentorBToken = loginMentorB.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Semana con bloques (mentorA)', () => {
    it('devuelve 200 y lista los bloques de la semana siguiente', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(expectedBlocks).toBeGreaterThan(0);
      expect(res.body).toHaveLength(expectedBlocks);
    });

    it('devuelve cada bloque con la estructura de la HU-02', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        id: expect.any(String),
        startAt: expect.any(String),
        endAt: expect.any(String),
        state: expect.stringMatching(/^(free|pending|confirmed)$/),
      });
    });
  });

  describe('Semana vacía (mentorB)', () => {
    it('devuelve 200 con un array vacío', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorBToken, from, to);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('Rango inválido', () => {
    it('devuelve 400 si to es anterior a from', async () => {
      const from = weeks.next.end.toISOString();
      const to = weeks.next.start.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(400);
    });

    it('devuelve 400 si el rango supera MAX_WEEK_QUERY_MS', async () => {
      const from = '2026-01-01T00:00:00Z';
      const to = new Date(new Date(from).getTime() + MAX_WEEK_QUERY_MS + 1).toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(400);
    });
  });

  describe('Sin sesión', () => {
    it('devuelve 401 sin token', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await request(app.getHttpServer())
        .get('/availability-blocks')
        .query({ from, to });

      expect(res.status).toBe(401);
    });
  });

  describe('Rendimiento', () => {
    it(`responde los bloques de la semana siguiente en menos de ${MAX_RESPONSE_MS} ms`, async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const start = Date.now();
      const res = await getMyBlocks(mentorAToken, from, to);
      const duration = Date.now() - start;

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(expectedBlocks);
      expect(duration).toBeLessThan(MAX_RESPONSE_MS);
    });
  });
});
