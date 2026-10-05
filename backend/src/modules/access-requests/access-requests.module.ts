import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AccessRequestsController } from './controllers/access-requests.controller.js';
import { AccessRequestsService } from './services/access-requests.service.js';
import { AccessRequestsRepository } from './repositories/access-requests.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [AccessRequestsController],
  providers: [AccessRequestsService, AccessRequestsRepository],
  exports: [AccessRequestsService],
})
export class AccessRequestsModule {}
