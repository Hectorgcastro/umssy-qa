import { beforeEach, describe, expect, it } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { PrismaModule } from '../../../common/prisma/prisma.module.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { CvFileController } from '../controllers/cv-file.controller.js';
import { CvController } from '../controllers/cv.controller.js';
import { ProfilePhotoController } from '../controllers/profile-photo.controller.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { CvMapper } from '../mappers/cv.mapper.js';
import { ProfilePhotoMapper } from '../mappers/profile-photo.mapper.js';
import { ProfileMapper } from '../mappers/profile.mapper.js';
import { ProfileModule } from '../profile.module.js';
import { CityRepository } from '../repositories/city.repository.js';
import { CvFileRepository } from '../repositories/cv-file.repository.js';
import { CvMetadataRepository } from '../repositories/cv-metadata.repository.js';
import { PhotoFileRepository } from '../repositories/photo-file.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { CvService } from '../services/cv.service.js';
import { FileValidationService } from '../services/file-validation.service.js';
import { ProfilePhotoService } from '../services/profile-photo.service.js';
import { ProfileService } from '../services/profile.service.js';
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
    ProfileController,
    CvController,
    CvFileController,
    ProfileService,
    CvService,
    ProfileRepository,
    CityRepository,
    CvMetadataRepository,
    ProfileMapper,
    CvMapper,
    FileValidationService,
    ProfilePhotoController,
    ProfilePhotoService,
    PhotoFileRepository,
    ProfilePhotoMapper,
    JwtAuthGuard,
  ])('resolves %o', (provider) => {
    expect(moduleRef.get(provider)).toBeInstanceOf(provider);
  });

  it('binds the file storage abstraction to the cv database implementation', () => {
    expect(moduleRef.get(FileStorage)).toBeInstanceOf(CvFileRepository);
  });
});
