import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository.js';
import { mapEventsToListResponse } from '../mappers/events.mapper.js';
import { EventsInvalidDateRangeException } from '../exceptions/events-invalid-date-range.exception.js';
import type { GetEventsPayload } from '../requests/get-events.request.js';
import type { EventsListResponse } from '../types/events.types.js';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async findAll(payload: GetEventsPayload): Promise<EventsListResponse> {
    // Validar que el rango de fechas sea coherente
    if (payload.from !== undefined && payload.to !== undefined) {
      if (new Date(payload.from) > new Date(payload.to)) {
        throw new EventsInvalidDateRangeException();
      }
    }

    const records = await this.eventsRepository.findMany(payload);
    return mapEventsToListResponse(records, payload.page, payload.limit);
  }
}
