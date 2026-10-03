import { beforeEach, describe, expect, it } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../../common/prisma/prisma.module.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CvFileController } from '../controllers/cv-file.controller.js';
import { CvController } from '../controllers/cv.controller.js';
import { CvMapper } from '../mappers/cv.mapper.js';
import { ProfileMapper } from '../mappers/profile.mapper.js';
import { ProfileModule } from '../profile.module.js';
import { CvFileRepository } from '../repositories/cv-file.repository.js';
import { CvMetadataRepository } from '../repositories/cv-metadata.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { CvService } from '../services/cv.service.js';
import { FileValidationService } from '../services/file-validation.service.js';
import { FileStorage } from '../types/file-storage.type.js';

describe('ProfileModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ProfileModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  it.each([
    CvController,
    CvFileController,
    CvService,
    CvMetadataRepository,
    CvMapper,
    FileValidationService,
    ProfileRepository,
    ProfileMapper,
  ])('resolves %o', (provider) => {
    expect(moduleRef.get(provider)).toBeInstanceOf(provider);
  });

  it('binds the file storage abstraction to the cv database implementation', () => {
    expect(moduleRef.get(FileStorage)).toBeInstanceOf(CvFileRepository);
  });
});
