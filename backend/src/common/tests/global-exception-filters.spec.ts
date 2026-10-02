import { Controller, Get, NotFoundException, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module.js';
import { DomainException } from '../exceptions/domain.exception.js';

class SampleDomainException extends DomainException {
  constructor() {
    super('El bloque no existe', 404);
  }
}

@Controller('filters-check')
class FiltersCheckController {
  @Get('domain')
  throwDomain(): never {
    throw new SampleDomainException();
  }

  @Get('http')
  throwHttp(): never {
    throw new NotFoundException('Recurso no encontrado');
  }

  @Get('unexpected')
  throwUnexpected(): never {
    throw new Error('fallo inesperado');
  }
}

describe('Filtros globales de excepciones', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [FiltersCheckController],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('las excepciones de dominio conservan su código de estado', async () => {
    const response = await request(app.getHttpServer()).get('/filters-check/domain');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      data: null,
      detail: 'El bloque no existe',
      ok: false,
    });
  });

  it('las excepciones HTTP responden con el formato estándar', async () => {
    const response = await request(app.getHttpServer()).get('/filters-check/http');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ statusCode: 404, detail: 'Recurso no encontrado', ok: false });
  });

  it('los errores inesperados responden 500 sin exponer el detalle', async () => {
    const response = await request(app.getHttpServer()).get('/filters-check/unexpected');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      statusCode: 500,
      detail: 'Ocurrió un error interno en el servidor',
      ok: false,
    });
  });
});
