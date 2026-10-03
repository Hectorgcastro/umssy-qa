import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller.js';
import { EventsService } from './services/events.service.js';
import { EventsRepository } from './repositories/events.repository.js';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
})
export class EventsModule {}
import { EventRegistrationsController } from './controllers/event-registrations.controller.js';
import { EventRegistrationsService } from './services/event-registrations.service.js';
import { EventRegistrationsRepository } from './repositories/event-registrations.repository.js';

@Module({
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService, EventRegistrationsRepository],
  exports: [EventRegistrationsService],
})
export class EventsModule {}
