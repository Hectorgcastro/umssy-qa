import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaService } from '../src/common/prisma/prisma.service.js';

// Runs against the PostgreSQL test schema (.env.test, DB_SCHEMA=test).
// Prepare it once with `pnpm migrate:test:apply`, then run `pnpm test:e2e`.
const password = 'E2ePassword123';
const runId = Date.now().toString(36);
const emails = [`profile-a-${runId}@e2e.test`, `profile-b-${runId}@e2e.test`];

describe('Profile persistence (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cityId: string;

  const login = async (email: string): Promise<string> => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password, roleTag: 'titulado' })
      .expect(201);
    return response.body.accessToken as string;
  };

  beforeAll(async () => {
    process.env.JWT_SECRET ??= 'profile-e2e-secret';
    // Imported after the secret is set: AuthModule reads it when the module loads.
    const { AppModule } = await import('../src/app.module.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = moduleRef.get(PrismaService);

    const role = await prisma.role.upsert({
      where: { name: 'titulado' },
      update: {},
      create: { name: 'titulado' },
    });
    const city = await prisma.city.create({ data: { title: `E2E City ${runId}` } });
    cityId = city.id;

    const passwordHash = await bcrypt.hash(password, 10);
    for (const email of emails) {
      await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'User',
          email,
          password: passwordHash,
          roles: { create: { roleId: role.id } },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await app.close();
  });

  it('keeps the personal information for a new session of the same user', async () => {
    const personalInfo = {
      firstName: 'Valeria',
      lastName: 'Quispe',
      cityId,
      phone: '+591 70000000',
      personalEmail: 'valeria@mail.com',
    };

    const savingSession = await login(emails[0]);
    await request(app.getHttpServer())
      .patch('/profile/me/personal-info')
      .set('Authorization', `Bearer ${savingSession}`)
      .send(personalInfo)
      .expect(200);

    const newSession = await login(emails[0]);
    const response = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${newSession}`)
      .expect(200);

    expect(response.body.data).toMatchObject({
      firstName: 'Valeria',
      lastName: 'Quispe',
      phone: '+591 70000000',
      personalEmail: 'valeria@mail.com',
      city: { id: cityId, title: `E2E City ${runId}` },
    });
  });

  it('keeps the presentation for a new session of the same user', async () => {
    const savingSession = await login(emails[0]);
    await request(app.getHttpServer())
      .patch('/profile/me/presentation')
      .set('Authorization', `Bearer ${savingSession}`)
      .send({ headline: 'Junior web developer', aboutMe: 'Systems engineering graduate.' })
      .expect(200);

    const newSession = await login(emails[0]);
    const response = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${newSession}`)
      .expect(200);

    expect(response.body.data).toMatchObject({
      headline: 'Junior web developer',
      aboutMe: 'Systems engineering graduate.',
    });
  });

  it('does not show the data of another user', async () => {
    const otherUserSession = await login(emails[1]);
    const response = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${otherUserSession}`)
      .expect(200);

    expect(response.body.data).toMatchObject({
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      headline: null,
      city: null,
    });
  });

  it('rejects invalid data with structured field errors and keeps the saved data', async () => {
    const token = await login(emails[0]);

    const response = await request(app.getHttpServer())
      .patch('/profile/me/presentation')
      .set('Authorization', `Bearer ${token}`)
      .send({ headline: 'a'.repeat(151), aboutMe: 'Graduate.' })
      .expect(400);

    expect(response.body.ok).toBe(false);
    expect(response.body.data).toEqual([
      expect.objectContaining({ field: 'headline' }),
    ]);

    const profile = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(profile.body.data.headline).toBe('Junior web developer');
  });

  it('stores, returns and removes the profile photo', async () => {
    const token = await login(emails[0]);
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    );

    await request(app.getHttpServer())
      .put('/profile/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', png, { filename: 'photo.png', contentType: 'image/png' })
      .expect(200);

    const newSession = await login(emails[0]);
    const photo = await request(app.getHttpServer())
      .get('/profile/me/photo')
      .set('Authorization', `Bearer ${newSession}`)
      .expect(200);
    expect(photo.headers['content-type']).toBe('image/png');

    await request(app.getHttpServer())
      .delete('/profile/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app.getHttpServer())
      .get('/profile/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
