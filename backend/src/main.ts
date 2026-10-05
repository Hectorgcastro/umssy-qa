import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';

let appInstance: INestApplication | undefined;

export async function bootstrap(): Promise<INestApplication> {
  if (appInstance) {
    return appInstance;
  }

  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  // Content-Disposition expuesto para que el frontend lea el nombre de los archivos exportados.
  app.enableCors({
    ...(corsOrigins.length > 0 ? { origin: corsOrigins } : {}),
    exposedHeaders: ['Content-Disposition'],
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('None')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  if (process.env.VERCEL) {
    await app.init();
  } else {
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    console.log(
      `[bootstrap] listening on port ${port}; cors origins=${
        corsOrigins.length > 0 ? corsOrigins.join(', ') : '(default: all origins)'
      }`,
    );
  }

  appInstance = app;
  return app;
}

if (!process.env.VERCEL) {
  try {
    await bootstrap();
  } catch (error: unknown) {
    console.error('[bootstrap] FAILED', error);
    process.exit(1);
  }
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  if (req.originalUrl && req.url !== req.originalUrl) {
    req.url = req.originalUrl;
  }
  return expressApp(req, res);
}

