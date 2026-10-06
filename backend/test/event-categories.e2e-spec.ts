import { AppModule } from '../src/app.module.js';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { vi } from 'vitest';
import { PrismaService } from '../src/common/prisma/prisma.service.js';

function buildPrismaCategoryRecord(overrides = {}) {
  return {
    id: 'cat-001',
    name: 'Tecnologia',
    ...overrides,
  };
}

const findManyMock = vi.fn().mockResolvedValue([buildPrismaCategoryRecord()]);
const countMock = vi.fn().mockResolvedValue(1);

const prismaMock = {
  event: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  eventCategory: {
    findMany: findManyMock,
    count: countMock,
  },
  eventRegistration: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  $transaction: vi.fn().mockImplementation((promises) => Promise.all(promises)),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

describe('EventCategoriesController (e2e)', () => {
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

  it('GET /api/event-categories - returns paginated list with data.items, total, limit, and totalPages', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaCategoryRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/event-categories')
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
      id: 'cat-001',
      name: 'Tecnologia',
    });
    expect(prismaMock.eventCategory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
    );
  });

  it('GET /api/event-categories?search=tec - filters by name search term', async () => {
    findManyMock.mockResolvedValueOnce([buildPrismaCategoryRecord()]);
    countMock.mockResolvedValueOnce(1);

    const res = await request(app.getHttpServer())
      .get('/api/event-categories?search=tec')
      .expect(200);

    expect(res.body.statusCode).toBe(200);
    expect(prismaMock.eventCategory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: { contains: 'tec', mode: 'insensitive' },
        }),
      }),
    );
  });

  it('GET /api/event-categories?page=2&limit=5 - respects pagination and calculates offset', async () => {
    findManyMock.mockResolvedValueOnce([]);
    countMock.mockResolvedValueOnce(0);

    const res = await request(app.getHttpServer())
      .get('/api/event-categories?page=2&limit=5')
      .expect(200);

    expect(res.body.page).toBe(2);
    expect(res.body.offset).toBe(5);
    expect(res.body.data.limit).toBe(5);
    expect(res.body.data.items).toHaveLength(0);
  });

  it('GET /api/event-categories - returns empty items when no categories exist', async () => {
    findManyMock.mockResolvedValueOnce([]);
    countMock.mockResolvedValueOnce(0);

    const res = await request(app.getHttpServer())
      .get('/api/event-categories')
      .expect(200);

    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.totalPages).toBe(0);
  });

  it('GET /api/event-categories?limit=100 - rejects limit greater than MAX_PAGE_SIZE (50)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/event-categories?limit=100')
      .expect(400);

    expect(res.body.ok).toBe(false);
  });

  it('GET /api/event-categories?search=... - rejects search greater than CATEGORIES_MAX_SEARCH_LENGTH (150)', async () => {
    const longSearch = 'a'.repeat(151);
    const res = await request(app.getHttpServer())
      .get(`/api/event-categories?search=${longSearch}`)
      .expect(400);

    expect(res.body.ok).toBe(false);
  });

  it('GET /api/event-categories?page=0 - rejects page less than 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/event-categories?page=0')
      .expect(400);

    expect(res.body.ok).toBe(false);
  });
});
