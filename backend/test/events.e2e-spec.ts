import { AppModule } from '../src/app.module.js';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { vi } from 'vitest';
import { PrismaService } from '../src/common/prisma/prisma.service.js';

function buildPrismaEventRecord(overrides = {}) {
  return {
    id: 'evt-001',
    title: 'Taller de Node.js',
    description: 'Aprende Node',
    categoryId: 'cat-001',
    instructorName: 'Ana Garcia',
    eventDate: new Date('2026-09-01T00:00:00.000Z'),
    startTime: new Date('1970-01-01T09:00:00.000Z'),
    endTime: new Date('1970-01-01T11:00:00.000Z'),
    location: 'Sala B',
    capacity: 30,
    statusId: 'status-001',
    modalityId: 'modality-001',
    category: { id: 'cat-001', name: 'Tecnologia' },
    _count: { registrations: 10 },
    ...overrides,
  };
}

const findManyMock = vi.fn().mockResolvedValue([buildPrismaEventRecord()]);
const countMock = vi.fn().mockResolvedValue(1);

const prismaMock = {
  event: {
    findMany: findManyMock,
    count: countMock,
    findUnique: vi.fn(),
  },
  $transaction: vi.fn().mockImplementation((promises) => Promise.all(promises)),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

describe('EventsController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    vi.clearAllMocks();
    if (app) {
      await app.close();
    }
  });

  it('GET /api/events - returns paginated list with data.items, total, limit, and totalPages', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaEventRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/events')
      .expect(200);

    expect(res.body).toMatchObject({
      statusCode: 200,
      ok: true,
      detail: 'Operación exitosa',
      page: 1,
      offset: 0,
      data: {
        total: 1,
        limit: 10,
        totalPages: 1,
      },
    });
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items[0]).toMatchObject({
      id: 'evt-001',
      title: 'Taller de Node.js',
      eventDate: '2026-09-01',
      startTime: '09:00',
      endTime: '11:00',
      availableSpots: 20,
      registrationCount: 10,
      instructorName: 'Ana Garcia',
      modalityId: 'modality-001',
      category: { id: 'cat-001', name: 'Tecnologia' },
    });
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { title: 'Publicado' },
        }),
      }),
    );
  });

  it('GET /api/events?statusId=123e4567-e89b-12d3-a456-426614174000 - filters by explicit statusId', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaEventRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/events?statusId=123e4567-e89b-12d3-a456-426614174000')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          statusId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      }),
    );
  });

  it('GET /api/events?search=Node - filters by title search term', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaEventRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/events?search=Node')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(res.body.data.total).toBe(1);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: { contains: 'Node', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('GET /api/events?categoryId=123e4567-e89b-12d3-a456-426614174000 - filters by categoryId', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaEventRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/events?categoryId=123e4567-e89b-12d3-a456-426614174000')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
        }),
      }),
    );
  });

  it('GET /api/events?search=Node&categoryId=123e4567-e89b-12d3-a456-426614174000 - combines search and categoryId', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaEventRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get(
        '/api/events?search=Node&categoryId=123e4567-e89b-12d3-a456-426614174000',
      )
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          title: { contains: 'Node', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('GET /api/events?search=100%25 - handles special characters like percent sign', async () => {
    findManyMock.mockResolvedValueOnce([]);
    countMock.mockResolvedValueOnce(0);

    const res = await request(app.getHttpServer())
      .get('/api/events?search=100%25')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(res.body.data.total).toBe(0);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: { contains: '100\\%', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('GET /api/events?search=_ - escapes underscore wildcard in search', async () => {
    findManyMock.mockResolvedValueOnce([]);
    countMock.mockResolvedValueOnce(0);

    const res = await request(app.getHttpServer())
      .get('/api/events?search=_')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: { contains: '\\_', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('GET /api/events?page=2&limit=5 - respects pagination parameters and calculates offset', async () => {
    findManyMock.mockResolvedValueOnce([]);
    countMock.mockResolvedValueOnce(0);

    const res = await request(app.getHttpServer())
      .get('/api/events?page=2&limit=5')
      .expect(200);

    expect(res.body.page).toBe(2);
    expect(res.body.offset).toBe(5);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.limit).toBe(5);
    expect(res.body.data.totalPages).toBe(0);
    expect(res.body.data.items).toHaveLength(0);
  });

  it('GET /api/events?limit=100 - rejects limit greater than MAX_PAGE_SIZE (50)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/events?limit=100')
      .expect(400);

    expect(res.body.ok).toBe(false);
  });

  it('GET /api/events?search=... - rejects search greater than MAX_SEARCH_LENGTH (150)', async () => {
    const longSearch = 'a'.repeat(151);
    const res = await request(app.getHttpServer())
      .get(`/api/events?search=${longSearch}`)
      .expect(400);

    expect(res.body.ok).toBe(false);
  });

  it('GET /api/events?page=0 - rejects page less than 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/events?page=0')
      .expect(400);

    expect(res.body.ok).toBe(false);
  });

  it('GET /api/events?categoryId=invalid - rejects invalid UUID', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/events?categoryId=not-a-uuid')
      .expect(400);

    expect(res.body.ok).toBe(false);
  });
  it('GET /api/events/:id returns normalized detail from the repository', async () => {
    const id = '33333333-3333-3333-3333-333333333332';
    prismaMock.event.findUnique.mockResolvedValueOnce(
      buildPrismaEventRecord({
        id,
        capacity: 10,
        modality: { id: 'modality-001', title: 'Presencial' },
      }),
    );
    const res = await request(app.getHttpServer())
      .get(`/api/events/${id}`)
      .expect(200);
    expect(res.body.data).toMatchObject({
      id,
      eventDate: '2026-09-01',
      startTime: '09:00',
      endTime: '11:00',
      registrationCount: 10,
      availableSpots: 0,
      modality: { title: 'Presencial' },
    });
    expect(res.body.data).not.toHaveProperty('_count');
  });

  it('GET /api/events/:id returns 404 when the workshop is missing', async () => {
    prismaMock.event.findUnique.mockResolvedValueOnce(null);
    await request(app.getHttpServer())
      .get('/api/events/33333333-3333-3333-3333-333333333339')
      .expect(404);
  });

  it('GET /api/events/:id rejects malformed identifiers', async () => {
    await request(app.getHttpServer())
      .get('/api/events/not-a-uuid')
      .expect(400);
    expect(prismaMock.event.findUnique).not.toHaveBeenCalled();
  });
  it('accepts the original Tecnología category when returning from another category', async () => {
    for (const categoryId of [
      '22222222-2222-2222-2222-222222222221',
      '123e4567-e89b-12d3-a456-426614174000',
      '22222222-2222-2222-2222-222222222221',
    ]) {
      await request(app.getHttpServer())
        .get(`/api/events?categoryId=${categoryId}`)
        .expect(200);
      expect(findManyMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId }),
        }),
      );
    }
  });
});
