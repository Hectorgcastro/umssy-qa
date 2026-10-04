import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller.js';
import { EventsService } from './services/events.service.js';
import { EventsRepository } from './repositories/events.repository.js';
import { EventCategoriesController } from './controllers/event-categories.controller.js';
import { EventCategoriesService } from './services/event-categories.service.js';
import { EventCategoriesRepository } from './repositories/event-categories.repository.js';
import { EventRegistrationsController } from './controllers/event-registrations.controller.js';
import { EventRegistrationsService } from './services/event-registrations.service.js';
import { EventRegistrationsRepository } from './repositories/event-registrations.repository.js';

@Module({
  controllers: [
    EventsController,
    EventCategoriesController,
    EventRegistrationsController,
  ],
  providers: [
    EventsService,
    EventsRepository,
    EventCategoriesService,
    EventCategoriesRepository,
    EventRegistrationsService,
    EventRegistrationsRepository,
  ],
  exports: [
    EventRegistrationsService,
  ],
})
export class EventsModule {}
