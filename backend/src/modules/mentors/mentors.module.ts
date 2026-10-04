import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MentorsController } from './controllers/mentors.controller.js';
import { MentorsService } from './services/mentors.service.js';
import { MentorsRepository } from './repositories/mentors.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [MentorsController],
  providers: [MentorsService, MentorsRepository],
})
export class MentorsModule {}
