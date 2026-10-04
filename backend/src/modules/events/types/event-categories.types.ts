import type { Prisma } from '../../../prisma/client.js';
import type { EventCategoryResponse } from './events.types.js';

export interface EventCategoriesListDataResponse {
  items: EventCategoryResponse[];
  total: number;
  limit: number;
  totalPages: number;
}

export interface EventCategoriesListResponse {
  data: EventCategoriesListDataResponse;
  page: number;
  offset: number;
}

export type EventCategoryWithFields = Prisma.EventCategoryGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export interface FindEventCategoriesPayload {
  search?: string;
  skip: number;
  take: number;
}

export interface FindEventCategoriesResponse {
  items: EventCategoryWithFields[];
  total: number;
}
