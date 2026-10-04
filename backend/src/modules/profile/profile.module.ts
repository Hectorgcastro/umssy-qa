import { Module } from '@nestjs/common';
import { JwtAuthModule } from '../../common/guards/jwt-auth.module.js';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { CvFileController } from './controllers/cv-file.controller.js';
import { CvController } from './controllers/cv.controller.js';
import { ProfileController } from './controllers/profile.controller.js';
import { CvMapper } from './mappers/cv.mapper.js';
import { ProfileMapper } from './mappers/profile.mapper.js';
import { CityRepository } from './repositories/city.repository.js';
import { CvFileRepository } from './repositories/cv-file.repository.js';
import { CvMetadataRepository } from './repositories/cv-metadata.repository.js';
import { ProfileRepository } from './repositories/profile.repository.js';
import { CvService } from './services/cv.service.js';
import { ProfileService } from './services/profile.service.js';
import { FileValidationService } from './services/file-validation.service.js';
import { FileStorage } from './types/file-storage.type.js';

@Module({
  imports: [PrismaModule, JwtAuthModule],
  controllers: [ProfileController, CvController, CvFileController],
  providers: [
    CvService,
    CvMetadataRepository,
    CvMapper,
    FileValidationService,
    { provide: FileStorage, useClass: CvFileRepository },
    ProfileService,
    ProfileRepository,
    CityRepository,
    ProfileMapper,
  ],
  exports: [FileValidationService],
})
export class ProfileModule {}
