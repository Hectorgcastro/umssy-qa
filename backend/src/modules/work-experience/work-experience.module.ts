import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { WorkExperienceMapper } from './mappers/work-experience.mapper.js';
import { WorkExperienceRepository } from './repositories/work-experience.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [WorkExperienceRepository, WorkExperienceMapper],
})
export class WorkExperienceModule {}