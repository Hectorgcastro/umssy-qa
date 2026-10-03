import { Module } from '@nestjs/common';
import { EventRegistrationsController } from './controllers/event-registrations.controller.js';
import { EventRegistrationsService } from './services/event-registrations.service.js';
import { EventRegistrationsRepository } from './repositories/event-registrations.repository.js';

@Module({
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService, EventRegistrationsRepository],
  exports: [EventRegistrationsService],
})
export class EventsModule {}