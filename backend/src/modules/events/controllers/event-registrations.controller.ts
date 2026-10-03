import { Controller, Get, Query } from '@nestjs/common';
import { EventRegistrationsService } from '../services/event-registrations.service.js';

@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly service: EventRegistrationsService) {}

  @Get('me')
  findMine(@Query('userId') userId: string) {
    return this.service.findMine(userId);
  }
}