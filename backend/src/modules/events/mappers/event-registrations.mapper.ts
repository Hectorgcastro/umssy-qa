import type { MyRegistrationResponse } from '../types/event-registrations.types.js';
import type { EventRegistrationsRepository } from '../repositories/event-registrations.repository.js';

type RegistrationEntity = Awaited<
  ReturnType<EventRegistrationsRepository['findByUserId']>
>[number];

export class EventRegistrationsMapper {
  static toMyRegistration(entity: RegistrationEntity): MyRegistrationResponse {
    return {
      id: entity.id,
      eventName: entity.event.title,
      date: entity.event.eventDate,
      location: entity.event.location ?? 'Virtual',
      status: entity.status.title,
    };
  }

  static toMyRegistrationList(
    entities: RegistrationEntity[],
  ): MyRegistrationResponse[] {
    return entities.map((e) => EventRegistrationsMapper.toMyRegistration(e));
  }
}