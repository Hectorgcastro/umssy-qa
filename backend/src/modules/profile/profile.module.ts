import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { ProfileMapper } from './mappers/profile.mapper.js';
import { CvFileRepository } from './repositories/cv-file.repository.js';
import { ProfileRepository } from './repositories/profile.repository.js';
import { FileValidationService } from './services/file-validation.service.js';
import { FileStorage } from './types/file-storage.type.js';

@Module({
  imports: [PrismaModule],
  providers: [
    FileValidationService,
    { provide: FileStorage, useClass: CvFileRepository },
    ProfileRepository,
    ProfileMapper,
  ],
  exports: [FileValidationService],
})
export class ProfileModule {}
