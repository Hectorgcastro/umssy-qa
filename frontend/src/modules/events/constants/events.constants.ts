import type { EventFiltersPayload } from '../types/event-filters.types';

export const EVENTS_PAGE_SIZE = 50;

export const NO_EVENT_FILTERS: EventFiltersPayload = {
  search: '',
  categoryId: null,
};