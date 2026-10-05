import 'dotenv/config';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';
import type { PrismaClient } from '../src/prisma/client.js';
import { SEED_USERS, SEED_PASSWORD } from '../src/modules/users/constants/seed-users.constants.js';
import { getWeeks } from '../src/modules/availability/seeds/availability.seed.js';
import { MAX_WEEK_QUERY_MS } from '../src/modules/availability/constants/week-query.constants.js';

const _emailOf = (key: (typeof SEED_USERS)[number]['key']): string =>
  SEED_USERS.find((user) => user.key === key)?.email ?? '';

describe('GET /availability-blocks (mis bloques) - H2-E', () => {
  let app: INestApplication;
  let _prisma: PrismaClient;
  let mentorAToken: string;
  let mentorBToken: string;
  const weeks = getWeeks(new Date());

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const seedClient = (await import('../src/common/database/seeds.js')).createSeedClient();
    const client = seedClient;
    await (await import('../src/common/database/seeds.js')).runSeed(client);

    const loginMentorA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'mentor.a@umssy.test', password: SEED_PASSWORD, roleTag: 'mentor' });
    mentorAToken = loginMentorA.body.accessToken;

    const loginMentorB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'mentor.b@umssy.test', password: SEED_PASSWORD, roleTag: 'mentor' });
    mentorBToken = loginMentorB.body.accessToken;
  });

  afterAll(async () => {
    const seedClient = (await import('../src/common/database/seeds.js')).createSeedClient();
    await seedClient.$disconnect();
  });

  const getMyBlocks = (token: string, from: string, to: string) =>
    request(app.getHttpServer())
      .get('/availability-blocks')
      .set('Authorization', `Bearer ${token}`)
      .query({ from, to });

  describe('Semana con bloques (mentorA tiene 50 bloques en la semana siguiente + trio en semana actual)', () => {
    it('devuelve 200 y lista los bloques del mentor autenticado (>= 50)', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(200);
      const data = Array.isArray(res.body.data) ? res.body.data : (Array.isArray(res.body) ? res.body : []);
      expect(data.length).toBeGreaterThanOrEqual(50);
    });

    it('los bloques tienen la estructura correcta (id, startAt, endAt, state)', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      const data = Array.isArray(res.body.data) ? res.body.data : (Array.isArray(res.body) ? res.body : []);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toMatchObject({
        id: expect.any(String),
        startAt: expect.any(String),
        endAt: expect.any(String),
        state: expect.stringMatching(/^(free|pending|confirmed)$/),
      });
    });
  });

  describe('Semana vacía (mentorB no tiene bloques)', () => {
    it('devuelve 200 con array vacío', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await getMyBlocks(mentorBToken, from, to);

      expect(res.status).toBe(200);
      const data = Array.isArray(res.body.data) ? res.body.data : (Array.isArray(res.body) ? res.body : []);
      expect(data).toEqual([]);
    });
  });

  describe('Rango inválido', () => {
    it('to anterior a from -> 400', async () => {
      const from = weeks.next.end.toISOString();
      const to = weeks.next.start.toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(400);
    });

    it('rango mayor a MAX_WEEK_QUERY_MS -> 400', async () => {
      const from = '2026-01-01T00:00:00Z';
      const to = new Date(new Date(from).getTime() + MAX_WEEK_QUERY_MS + 1).toISOString();

      const res = await getMyBlocks(mentorAToken, from, to);

      expect(res.status).toBe(400);
    });
  });

  describe('Sin sesión (sin token)', () => {
    it('devuelve 401', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const res = await request(app.getHttpServer())
        .get('/availability-blocks')
        .query({ from, to });

      expect(res.status).toBe(401);
    });
  });

  describe('Rendimiento: 50 bloques en menos de 3 segundos', () => {
    it('responde en menos de 3000ms con 50 bloques', async () => {
      const from = weeks.next.start.toISOString();
      const to = weeks.next.end.toISOString();

      const start = Date.now();
      const res = await getMyBlocks(mentorAToken, from, to);
      const _duration = Date.now() - start;

      expect(res.status).toBe(200);
      const data = Array.isArray(res.body.data) ? res.body.data : (Array.isArray(res.body) ? res.body : []);
      expect(data.length).toBeGreaterThanOrEqual(50);
      expect(Date.now() - start).toBeLessThan(3000);
    });
  });
});