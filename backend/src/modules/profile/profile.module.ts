import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { CvFileController } from './controllers/cv-file.controller.js';
import { CvController } from './controllers/cv.controller.js';
import { CvMapper } from './mappers/cv.mapper.js';
import { ProfileMapper } from './mappers/profile.mapper.js';
import { CvFileRepository } from './repositories/cv-file.repository.js';
import { CvMetadataRepository } from './repositories/cv-metadata.repository.js';
import { ProfileRepository } from './repositories/profile.repository.js';
import { CvService } from './services/cv.service.js';
import { FileValidationService } from './services/file-validation.service.js';
import { FileStorage } from './types/file-storage.type.js';

@Module({
  imports: [PrismaModule],
  controllers: [CvController, CvFileController],
  providers: [
    CvService,
    CvMetadataRepository,
    CvMapper,
    FileValidationService,
    { provide: FileStorage, useClass: CvFileRepository },
    ProfileRepository,
    ProfileMapper,
  ],
  exports: [FileValidationService],
})
export class ProfileModule {}
