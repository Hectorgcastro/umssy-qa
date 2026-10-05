import { Module } from '@nestjs/common';
import { AccessRequestsController } from './controllers/access-requests.controller.js';
import { AccessRequestsService } from './services/access-requests.service.js';
import { AccessRequestsRepository } from './repositories/access-requests.repository.js';

@Module({
  controllers: [AccessRequestsController],
  providers: [AccessRequestsService, AccessRequestsRepository],
  exports: [AccessRequestsService],
})
export class AccessRequestsModule {}
