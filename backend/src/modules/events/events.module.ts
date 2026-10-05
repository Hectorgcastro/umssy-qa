import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller.js';
import { EventsService } from './services/events.service.js';
import { EventsRepository } from './repositories/events.repository.js';
import { EventCategoriesController } from './controllers/event-categories.controller.js';
import { EventCategoriesService } from './services/event-categories.service.js';
import { EventCategoriesRepository } from './repositories/event-categories.repository.js';

@Module({
  controllers: [EventsController, EventCategoriesController],
  providers: [
    EventsService,
    EventsRepository,
    EventCategoriesService,
    EventCategoriesRepository,
  ],
  exports: [EventsService],
})
export class EventsModule {}
